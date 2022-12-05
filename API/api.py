# Imports

# Flask
from flask import Flask, render_template, send_file
from markupsafe import escape

# Others
import pyautogui
import pydirectinput as pag
import os
import time
import datetime


import subprocess
import threading
import sys

# Correr servidor ngrok
command = 'ngrok http 5000'.split(' ')
threading.Thread(target = lambda: subprocess.run(command)).start()



# print(os.path.dirname(sys.executable))
app = Flask(__name__)
app.config.from_pyfile(f'{os.path.dirname(sys.executable)}/api_configs.py')

global press_keys
press_keys = True



# GTP
# URLs
@app.route('/GTP/API/press/<string:dkey>')
def down_key(dkey):
    # Down key.

    global press_keys
    if press_keys:
        pag.press(dkey)

        # Feedback
        return f'He oprimido la tecla {escape(dkey).upper()}', 200
    
    else:
        walk_macro(1)
        time.sleep(3)

        press_keys = True
        return f'Walk macro activated.', 200


@app.route('/GTP/API/macros/walk')
def walk_macro(work_type: int):
    if work_type == 1:
        # Caminar hacia la zona de trabajo.
        pag.keyDown('w') # Teclado para avanazr
        time.sleep(5.3)
        pag.keyUp('w') # Tecla para dejar de avanzar.

        # Dejamos la roca
        pag.press('alt')
        pag.press('alt')
        pag.press('alt')
        pag.press('alt') # redundancia



        # pag.press('d') # redundancia
        # pag.press('d') # redundancia
        pag.keyDown('s') # Tecla para retrodeceder.
        time.sleep(5.3)
        pag.keyUp('s') # Tecla para dejar de retroceder.
        pag.press('f')
        pag.press('f')


        global press_keys
        press_keys = True
    return 'Walking...'


@app.route('/GTP/API/disable/press')
def disbale_pk():
    global press_keys
    press_keys = False
    
    return 'Disabled :('

@app.route('/GTP/API/enable/press')
def enable_pk():
    global press_keys
    press_keys = True

    print(press_keys)
    return 'Enabled!'


@app.route('/GTP/API/get/pressvar')
def getpressvar():
    if press_keys:
        return 'True'

    else:
        return 'False'




@app.route('/GTP/UI')
def GToolUI():
    return render_template('GTP/GTP.html')




# GTP FILES
@app.route('/GTP/Files/MainJS')
def GTP_Appjs():
    return send_file('Templates/GTP/scripts/app.js')


@app.route('/GTP/Files/ModelTrain/<string:format>/<int:accuracy>')
def GTP_ModelJson(accuracy, format):
    if os.path.isfile(os.path.abspath(f'{os.path.dirname(sys.executable)}/Templates/GTP/Models/{accuracy}/model-{accuracy}.{format}')):
        return send_file(f'{os.path.dirname(sys.executable)}/Templates/GTP/Models/{accuracy}/model-{accuracy}.{format}'), 200
    
    else: 
        return 'Error to found file with this accuracy.', 404


# TEST!!!!!!
@app.route('/GTP/Files/ModelTrain/json/group1-shard1of1.bin')
def helping_to_tf():
    accuracy = 98
    return send_file(f'{os.path.dirname(sys.executable)}/Templates/GTP/Models/{accuracy}/model-{accuracy}.bin'), 200
    

app.run(port = 5000)