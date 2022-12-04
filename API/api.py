# Imports

# Flask
from flask import Flask, render_template, send_file
from markupsafe import escape

# Others
import pyautogui as pag


app = Flask(__name__)
app.config.from_pyfile('api_configs.py')


# URLs
@app.route('/down/key/<string:dkey>')
def down_key(dkey):
    # Down key.
    pag.press(dkey)

    # Feedback
    return f'He oprimido la tecla {escape(dkey).upper()}'



@app.route('/GTP/UI')
def GToolUI():
    return render_template('GTP/GTP.html')


@app.route('/GTP/Files/MainJS')
def GTP_Appjs():
    return send_file('Templates/GTP/scripts/app.js')



app.run(host = '192.168.0.3')