import os
import json
import logging
from aiohttp import web
from ot2update import endpoints

SETTINGS_FILE = '/mnt/usbdrive/config/update-server/logging-config.json'


def get_logging_config() -> dict:
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE) as cfg_f:
            logging_config = json.load(cfg_f)
    else:
        logging_config = {
            'format': '%(asctime)s %(name)s %(levelname)s [Line %(lineno)s] %(message)s',  # noqa
            'level': 'DEBUG'
        }
    return logging_config


def main():
    logging.basicConfig(**get_logging_config())
    log = logging.getLogger(__file__)

    port = os.environ.get('OT_UPDATE_PORT', 34000)
    log.info('Starting update server on localhost:{}'.format(port))
    app = web.Application()
    app.router.add_routes([
        web.get('/server/update/health', endpoints.health)
    ])
    web.run_app(app, port=port)


main()
