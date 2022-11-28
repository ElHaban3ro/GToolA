# Imports

# Flask
from flask import Flask
from markupsafe import escape

# Others
import pyautogui as pag


<<<<<<< HEAD
=======


>>>>>>> 701fc753f8c8c8886858567fd55e0da6a604b3d0
app = Flask(__name__)
app.config.from_pyfile('api_configs.py')


# URLs
@app.route('/down/key/<string:dkey>')
def down_key(dkey):
    # Down key.
    pag.press(dkey)

    # Feedback
    return f'He oprimido la tecla {escape(dkey).upper()}'




<<<<<<< HEAD
app.run(host = '192.168.0.3')
=======
app.run()
>>>>>>> 701fc753f8c8c8886858567fd55e0da6a604b3d0
