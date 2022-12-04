# Imports

# Flask
from flask import Flask, render_template, send_file
from markupsafe import escape

# Others
import pyautogui as pag
import os


app = Flask(__name__)
app.config.from_pyfile('api_configs.py')


# GTP

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




# GTP FILES
@app.route('/GTP/Files/MainJS')
def GTP_Appjs():
    return send_file('Templates/GTP/scripts/app.js')


@app.route('/GTP/Files/ModelTrain/<string:format>/<int:accuracy>')
def GTP_ModelJson(accuracy, format):
    if os.path.isfile(os.path.abspath(f'./API/Templates/GTP/Models/{accuracy}/model-{accuracy}.{format}')):
        return send_file(f'Templates/GTP/Models/{accuracy}/model-{accuracy}.{format}'), 200
    
    else: 
        return 'Error to found file with this accuracy.', 404


app.run(host = '192.168.0.3')