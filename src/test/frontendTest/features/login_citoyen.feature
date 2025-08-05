@connexion
Feature: Authentification Citoyen

  Afin d'accéder à l'espace Citoyen,
  En tant qu'utilisateur,
  Je souhaite pouvoir m'authentifier avec mes identifiants valides, et recevoir un message d'erreur en cas d'échec.
@connexiona
  Scenario Outline: Connexion réussie avec des identifiants valides
    Given je suis sur la page d'accueil du portail Citoyen
    When je clique sur le bouton "Citoyen" situé dans le coin supérieur droit
    And je saisis le NPI "<npi>" et le mot de passe "<password>"
    Then je vois la liste des parcelles


    Examples:
      | npi         | password       |
      | 1314276106  | Jesuisleroi1@  |
@connexionb
  Scenario Outline: Échec de connexion avec un mot de passe incorrect
    Given je suis sur la page d'accueil du portail Citoyen
    When je clique sur le bouton "Citoyen" situé dans le coin supérieur droit
    And je saisis le NPI "<npi>" et le mot de passe "<password>"
    Then un message d’erreur s’affiche indiquant que le nom d'utilisateur ou le mot de passe est incorrect

    Examples:
      | npi         | password          |
      | 1314276106  | FauxMotDePasse123 |
@connexionc
  Scenario Outline: Échec de connexion avec un NPI invalide
    Given je suis sur la page d'accueil du portail Citoyen
    When je clique sur le bouton "Citoyen" situé dans le coin supérieur droit
    And je saisis le NPI "<npi>" et le mot de passe "<password>"
    Then un message d’erreur s’affiche indiquant que le nom d'utilisateur ou le mot de passe est incorrect

    Examples:
      | npi        | password      |
      | 0000000000 | Jesuisleroi1@ |
@connexiond
  Scenario Outline: Échec de connexion avec un format de NPI invalide
    Given je suis sur la page d'accueil du portail Citoyen
    When je clique sur le bouton "Citoyen" situé dans le coin supérieur droit
    And je saisis le NPI "<npi>" et le mot de passe "<password>"
    Then un message d’erreur s’affiche indiquant que le nom d'utilisateur ou le mot de passe est incorrect

    Examples:
      | npi      | password      |
      | abcdefgh | Jesuisleroi1@ |
      | 12       | Jesuisleroi1@ |
@connexione
  Scenario: Le bouton "Se connecter" est désactivé si les champs sont vides
    Given je suis sur la page d'accueil du portail Citoyen
    When je clique sur le bouton "Citoyen" situé dans le coin supérieur droit
    Then le bouton "Se connecter" est désactivé
