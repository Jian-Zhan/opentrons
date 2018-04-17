import os
import json
import logging
from aiohttp import web
from pprint import pprint

log = logging.getLogger(__name__)

package_json = os.path.join(
    os.path.abspath(os.path.dirname(__file__)), 'package.json')
log.info("Loading package json from: {}".format(package_json))

if os.path.exists(package_json):
    with open(package_json) as pkg:
        package_dict = json.load(pkg)
        print("Package dict:")
        pprint(package_dict)
        version = package_dict.get('version')
else:
    print("No package json found at {}".format(package_json))
    version = 'unknown'

# this naming logic is copied from compute/scripts/anounce_mdns.py
device_name = 'opentrons-{}'.format(
    os.environ.get('RESIN_DEVICE_NAME_AT_INIT', 'dev'))


async def health(request):
    return web.json_response(
        {
            'name': device_name,
            'updateServerVersion': version
        },
        headers={'Access-Control-Allow-Origin': '*'}
    )
