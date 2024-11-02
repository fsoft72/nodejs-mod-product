#!/usr/bin/env python3

"""
This scripts reads data/listino.tsv and generates a restest JSON file to load all products in the DB
"""

import json


FIELDS = [
    "categ",
    "code",
    "name",
    "um",
    "valore",
    "price_vat",
    "SKIP",
    "vat",
    "curr_price_vat",
]

fin = open("data/listino.tsv")
fin.readline()  # skip header


def map_line(line):
    """
    Takes a line from the input file and returns a dictionary
    """
    fields = [x.strip() for x in line.strip().split("\t")]
    return dict(zip(FIELDS, fields))


def calc_net(price_vat, vat):
    price_vat = float(price_vat)
    vat = float(vat)

    # force 2 decimal digits
    return round(price_vat / (1 + vat / 100), 2)


rows = []

for line in fin:
    fields = map_line(line)

    row = {
        "method": "POST",
        "url": "/api/product/admin/add",
        "params": {
            "name": fields["name"],
            "code": fields["code"],
            "id_category": "%(id_categ_" + (fields["categ"].replace("-", "_")) + ")s",
            "code_forn": fields["code"],
            "description": fields["name"],
            "short_description": fields["name"],
            "cost": calc_net(fields["price_vat"], fields["vat"]),
            "price_net": calc_net(fields["price_vat"], fields["vat"]),
            "price_vat": fields["price_vat"],
            "vat": fields["vat"],
            "curr_price_net": calc_net(fields["curr_price_vat"], fields["vat"]),
            "curr_price_vat": fields["curr_price_vat"],
            "visible": True,
        },
    }

    rows.append(row)

fin.close()

fout = open("products.tests.json", "w")

fout.write(json.dumps({"actions": rows}, indent=4))

fout.close()
