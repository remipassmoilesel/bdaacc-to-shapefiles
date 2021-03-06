# Script d'aide à l'exploitation des bases de données annuelles des accidents corporels de la circulation routière

Ce projet contient un script permettant d'exploiter dans un système d'informations géographiques les bases de données
 annuelles des accidents corporels de la circulation routière

**Attention**: Ce script a été développé en quelques heures et n'a pas fait l'objet de contrôles qualité.
De plus, il n'a été testé que sur Ubuntu 18.04.


## Ressources
 
- Téléchargement des données: https://www.data.gouv.fr/fr/datasets/base-de-donnees-accidents-corporels-de-la-circulation/
- Description des données: https://static.data.gouv.fr/resources/base-de-donnees-accidents-corporels-de-la-circulation/20191014-112328/description-des-bases-de-donnees-onisr-annees-2005-a-2018.pdf


## Installation

Pour que ce script fonctionne vous devez installer NodeJS > 10 et ogr2ogr.

Sur Ubuntu:

    $ sudo apt install nodejs og2ogr


## Utilisation

Télécharger tous les documents nommées `caracteristiques_*` à partir du site data.gouv et les enregistrer dans le dossiercsv-files.

Corriger les positions et transformer les fichiers CSV en shapefiles:

    $ ./process-csv-files.js


Vérifier la sortie console et s'assurer qu'il n'y a pas d'erreurs.
