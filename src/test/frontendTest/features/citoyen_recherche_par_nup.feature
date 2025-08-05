Feature: Recherche et interaction avec la carte des parcelles
@recherchenup
  Scenario Outline: Rechercher une parcelle par NUP et afficher ses informations
    Given l'utilisateur accède à la page "<url>"
    When il saisit "<nup_initial>" dans le champ "Rechercher par NUP"
    And il clique sur "Aller sur la carte"
    Then une nouvelle page contenant la carte s'ouvre
    Then les informations de la parcelle sont affichées
    And il ferme la fenêtre d'information
    When il clique sur une autre parcelle sur la carte
    Then les informations de la nouvelle parcelle sont affichées
    And il ferme la fenêtre d'information
    When il effectue une nouvelle recherche avec le NUP "<nup_recherche>"
    And il clique deux fois sur le bouton de recherche
    Then les informations de la parcelle sont affichées à nouveau
    And il ferme la fenêtre d'information
    When il interagit avec les couches de la carte
    Then il peut activer différentes couches cartographiques et légendes

  Examples:
    | url                                 | nup_initial | nup_recherche |
    | https://test-citizen.andf.bj/       | 100283100   | 100283105     |
    
