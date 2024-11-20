import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Only if needed for CORS support


app = Flask(__name__)
CORS(app)  # Enable CORS for all origins, if needed


def generate_latex(data):
    name = data.get("name", "Name Not Provided")
    email = data.get("email", "Email Not Provided")
    phone = data.get("phone", "Phone Not Provided")
    address = data.get("address", "Address Not Provided")
    linkedin = data.get("linkedin", "LinkedIn Not Provided")
    github = data.get("github", "GitHub Not Provided")
    education = data.get("education", ["Education Not Provided"])
    skills = data.get("skills", ["Skills Not Provided"])
    experience = data.get("experience", "Experience Not Provided")
    occupation = data.get("occupation", "Occupation Not Provided")
    about_me = data.get("about_me", "About Me Not Provided")

    # Create LaTeX content
    latex_content = r"""
    \documentclass{article}
    \usepackage{hyperref}
    \begin{document}
    \title{CV for """ + name + r"""}
    \maketitle
    
    \section*{Contact Information}
    \begin{itemize}
        \item Email: """ + email + r"""
        \item Phone: """ + phone + r"""
        \item Address: """ + address + r"""
        \item LinkedIn: \url{""" + linkedin + r"""}
        \item GitHub: \url{""" + github + r"""}
    \end{itemize}

    \section*{Education}
    \begin{itemize}
    """
    for edu in education:
        latex_content += r"\item " + edu + r"\n"

    latex_content += r"\end{itemize}\n"

    latex_content += r"""
    \section*{Experience}
    """ + experience + r"""
    \section*{Occupation}
    """ + occupation + r"""
    \section*{About Me}
    """ + about_me + r"""

    \section*{Skills}
    \begin{itemize}
    """
    for skill in skills:
        latex_content += r"\item " + skill + r"\n"
    latex_content += r"""
    \end{itemize}
    \end{document}
    """

    # Save LaTeX file
    output_folder = "output"
    os.makedirs(output_folder, exist_ok=True)
    tex_file_path = os.path.join(output_folder, "cv_output.tex")
    with open(tex_file_path, "w") as f:
        f.write(latex_content)

    return tex_file_path


# Route to handle form submissions
@app.route('/submit', methods=['POST'])
def submit():
    data = request.json  # Retrieve JSON data from the request
    print("Received data:", data)  # Debugging step
    try:
        tex_file_path = generate_latex(data)  # Generate LaTeX file
        return jsonify({"message": f"LaTeX file created at {tex_file_path}!"})  # Respond to frontend
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)  # Run Flask app in debug mode