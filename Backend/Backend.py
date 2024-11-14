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
    latex_content = f"""
    \\documentclass{{article}}
    \\usepackage{{hyperref}}
    \\begin{document}
    \\title{{CV for {name}}}
    \\maketitle

    \\section*{{Contact Information}}
    \\begin{itemize}
        \\item Email: {email}
        \\item Phone: {phone}
        \\item Address: {address}
        \\item LinkedIn: \\url{{{linkedin}}}
        \\item GitHub: \\url{{{github}}}
    \\end{itemize}

    \\section*{{Education}}
    \\begin{itemize}
    """
    for edu in education:
        latex_content += f"\\item {edu}\n"

    latex_content += "\\end{itemize}\n"

    latex_content += f"\\section*{{Experience}}\n{experience}\n"
    latex_content += f"\\section*{{Occupation}}\n{occupation}\n"
    latex_content += f"\\section*{{About Me}}\n{about_me}\n"

    latex_content += "\\section*{{Skills}}\n\\begin{itemize}\n"
    for skill in skills:
        latex_content += f"\\item {skill}\n"
    latex_content += "\\end{itemize}\n"
    latex_content += "\\end{document}"

    # Save LaTeX file
    output_folder = "output"
    os.makedirs(output_folder, exist_ok=True)
    tex_file_path = os.path.join(output_folder, "cv_output.tex")
    with open(tex_file_path, "w") as f:
        f.write(latex_content)

    return tex_file_path

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    tex_file_path = generate_latex(data)
    return jsonify({"message": f"LaTeX file created at {tex_file_path}!"})

if __name__ == '__main__':
    app.run(debug=True)
