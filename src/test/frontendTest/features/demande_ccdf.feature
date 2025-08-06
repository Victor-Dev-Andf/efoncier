Feature: Demande de Confirmation de Droit Foncier (CCDF)


@reuseSession
Scenario Outline: Soumettre une demande CCDF avec donnée valide 
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  And je sélectionne le propriétaire "<proprietaire>"
  And je renseigne l'email "<email>"
  And je renseigne le téléphone "<telephone>"
  When je téléverse les fichiers suivants:
  | FP PAPA DOMETO Alphonse.pdf     |
  

  And je clique sur le bouton "Payer 2000 F CFA"
  Then je dois voir la notification "<notificationTexte>" s'affiche


  Examples: 
    | numeroParcelle | proprietaire      | email                    | telephone  | notificationTexte |
    | 100299241      | HOUESSOU VICTOR    | vhouessouro@gmail.com   | 0161240530 | Notification      |


### Scénario : Numéro de parcelle inexistant
@parcelleInexistante
Scenario Outline: Échec avec un numéro de parcelle inexistant
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  Then je dois voir un message d'erreur "Aucun résultat ne correspond à ce nup"


  Examples:
    | numeroParcelle | proprietaire | email | telephone | fichier |
    | 9999999        | -            | -     | -         | -       |


### Scénario : Email invalide
@emailInvalide
Scenario Outline: Échec avec un email invalide
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  And je sélectionne le propriétaire "<proprietaire>"
  And je renseigne l'email "<email>"
  And je renseigne le téléphone "<telephone>"
  When je téléverse les fichiers suivants:
  | FP PAPA DOMETO Alphonse.pdf     |
  

  And je clique sur le bouton "Payer 2000 F CFA"
  Then je dois voir la notification "<notificationTexte>" s'affiche
 ###  Then je dois voir un message d'erreur "Email invalide"

  Examples:
    | numeroParcelle | proprietaire       | email           | telephone | fichier                          | notificationTexte |
    | 100            | HOUESSOU VICTOR    | email_invalide | 0161240530 | FP PAPA DOMETO Alphonse.pdf      | Notification      |


### Scénario : Absence de fichier
@sansFichier
Scenario Outline: Échec sans fichier téléversé
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  And je sélectionne le propriétaire "<proprietaire>"
  And je renseigne l'email "<email>"
  And je renseigne le téléphone "<telephone>"
  And je clique sur le bouton "Payer 2000 F CFA"
  Then je dois voir la notification "<notificationTexte>" s'affiche

  Examples:
    | numeroParcelle | proprietaire      | email                   | telephone   | fichier  | notificationTexte |
    | 100            | HOUESSOU VICTOR    | vhouessouro@gmail.com   | 0161240530 |         | Notification      |


### Scénario : Paiement échoué
### @paiementEchoue
### Scenario Outline: Paiement refusé lors de la demande CCDF
  ### Given je suis connecté avec une session utilisateur existante
  ### When je clique sur le lien "e-services"
  ### And je clique sur le service "Confirmation de droitLa"
  ### And je clique sur le bouton "j'ai compris"
  ### And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  ### And je sélectionne le propriétaire "<proprietaire>"
  ### And je renseigne l'email "<email>"
  ### And je renseigne le téléphone "<telephone>"
  ### And je téléverse le fichier "<fichier>"
  ### And je clique sur le bouton "Payer 2000 F CFA"
  ### Then je dois voir un message "Le paiement a échoué, veuillez réessayer"

  ### Examples:
   ###  | numeroParcelle | proprietaire      | email                 | telephone  | fichier                           |
    ### | 1002571        | HOUESSOU VICTOR    | vhouessouro@gmail.com | 0161240530 | FP PAPA DOMETO Alphonse.pdf      |


### Scénario : Téléphone invalide
@telephoneInvalide
Scenario Outline: Saisie d’un téléphone invalide
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  And je sélectionne le propriétaire "<proprietaire>"
  And je renseigne l'email "<email>"
  And je renseigne le téléphone "<telephone>"
   When je téléverse les fichiers suivants:
  | FP PAPA DOMETO Alphonse.pdf     |
  

  And je clique sur le bouton "Payer 2000 F CFA"
  Then je dois voir la notification "<notificationTexte>" s'affiche
  ### Then je dois voir un message d'erreur "Numéro de téléphone invalide"

  Examples:
    | numeroParcelle | proprietaire      | email                 | telephone | fichier                           | notificationTexte |
    | 100            | HOUESSOU VICTOR    | vhouessouro@gmail.com | abc123    | FP PAPA DOMETO Alphonse.pdf      | Notification      |


### Scénario : Fichier non supporté
@fichierInvalide
Scenario Outline: Échec avec fichier au mauvais format
  Given je suis connecté avec une session utilisateur existante
  When je clique sur le lien "e-services"
  And je clique sur le service "Confirmation de droitLa"
  And je clique sur le bouton "j'ai compris"
  And je saisis le numéro de parcelle partiel "<numeroParcelle>"
  And je sélectionne le propriétaire "<proprietaire>"
  And je renseigne l'email "<email>"
  And je renseigne le téléphone "<telephone>"
  When je téléverse les fichiers suivants:
  | FP PAPA DOMETO Alphonse.pdf     |
  

  And je clique sur le bouton "Payer 2000 F CFA"
  Then je dois voir la notification "<notificationTexte>" s'affiche
  ###Then je dois voir un message d'erreur "Format de fichier non supporté"

  Examples:
    | numeroParcelle | proprietaire      | email                 | telephone  | fichier               |  notificationTexte |
    | 100            | HOUESSOU VICTOR    | vhouessouro@gmail.com | 0161240530 | script_malicious.exe |  Notification      |
