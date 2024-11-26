from flask import Flask, request, jsonify, send_file
import os
import tempfile

app = Flask(__name__)

@app.route('/generate_cv', methods=['POST'])
def generate_cv():
    try:
        # Log that the request was received
        print("Request received at /generate_cv")

        # Retrieve form data
        data = request.form
        uploaded_file = request.files.get('picture')

        # Extract form fields
        name = data.get('name', 'Unnamed')
        email = data.get('email', 'No Email Provided')
        phone = data.get('phone', 'No Phone Provided')
        address = data.get('address', 'No Address Provided')
        linkedin = data.get('linkedin', 'No LinkedIn Provided')
        github = data.get('github', 'No GitHub Provided')
        occupation = data.get('occupation1', 'No Occupation Provided')
        about_me = data.get('about', 'No About Me Provided')

        # Log the received form data
        print(f"Form data: name={name}, email={email}, phone={phone}, address={address}")
        print(f"LinkedIn: {linkedin}, GitHub: {github}, Occupation: {occupation}, About Me: {about_me}")

        # Handle uploaded file (picture)
        image_path = None
        if uploaded_file:
            temp_dir = tempfile.mkdtemp()
            image_path = os.path.join(temp_dir, uploaded_file.filename)
            uploaded_file.save(image_path)
            print(f"Image saved to {image_path}")
        else:
            print("No image uploaded.")

        # Generate LaTeX content
        latex_template = r"""
        \documentclass{{article}}
        \usepackage[margin=1in]{{geometry}}
        \usepackage{{graphicx}}
        \begin{{document}}

        \begin{{center}}
            \Large\textbf{{{name}}} \\
            \normalsize {address} \\
            Email: {email} \quad | \quad Phone: {phone} \\
            \href{{{linkedin}}}{{LinkedIn}} \quad | \quad \href{{{github}}}{{GitHub}}
        \end{{center}}

        \section*{{Occupation}}
        {occupation}

        \section*{{About Me}}
        {about_me}

        \section*{{Picture}}
        \begin{{center}}
        """.format(
            name=name,
            email=email,
            phone=phone,
            address=address,
            linkedin=linkedin,
            github=github,
            occupation=occupation,
            about_me=about_me,
        )

        # Include image in LaTeX if uploaded
        if image_path:
            latex_template += f"\\includegraphics[width=0.3\\textwidth]{{{image_path}}}\n"

        latex_template += r"""
        \end{center}
        \end{document}
        """

        print("LaTeX content generated.")

        # Save LaTeX file temporarily
        temp_dir = tempfile.mkdtemp()
        latex_file_path = os.path.join(temp_dir, "cv.tex")
        with open(latex_file_path, "w") as f:
            f.write(latex_template)

        print(f"LaTeX file saved at {latex_file_path}")

        # Return the LaTeX file to the client
        return send_file(
            latex_file_path,
            mimetype="application/x-tex",
            as_attachment=True,
            download_name="cv.tex",
        )
    except Exception as e:
        # Log the error and return an error message
        print(f"Error while generating CV: {e}")
        return jsonify({"error": "An error occurred while generating the CV."}), 500


if __name__ == '__main__':
    app.run(debug=True)
