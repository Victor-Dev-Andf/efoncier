Feature: Demande de copie de CEC en ligne

@demandeCec
  Scenario: Effectuer une demande de copie de CEC et payer en ligne
    Given l'utilisateur est sur la page d'accueil du portail citoyen
    When il clique sur le lien "e-services"
    And il va cliquer sur le service "Copie de CECEn cas de perte"
    And il clique sur le bouton "j'ai compris"
    And il saisit le numéro de parcelle partiel "<numeroParcelle>"
    And il sélectionne le propriétaire "<proprietaire>"
    And il va saisir son adresse email "<email>"
   And l'utilisateur a cliqué sur "Enregistrer la demande"
    And l'utilisateur voit "Transaction enregistrée avec"
    When l'utilisateur saisit "<nom>" comme nom
    And l'utilisateur saisit "<prenom>" comme prénom
    And l'utilisateur saisit "<emailE>" comme adresse e-mail
    And l'utilisateur choisit l'opérateur "<operateur>"
    And l'utilisateur saisit "<telephone>" comme numéro de téléphone
    And l'utilisateur clique sur le bouton "<bouton_payer>"
    Then le résumé de la transaction contenant "<texte_resume>" s'affiche
    And le reçu contenant "<texte_recu>" s'affiche
     Examples:
    | numeroParcelle | proprietaire       | email                    | telephone    | fichier                          |    nom   | prenom | emailE                 | operateur    | telephone   | bouton_payer | texte_resume                                 | texte_recu            |
    | 100299802     | Groupe fermer    | vhouessouro@gmail.com    |  0161240530  | FP PAPA DOMETO Alphonse.pdf      | Houessou | victor | vhouessouro@gmail.com  | Mtn Bénin    | 0161240530  | Payer 1 CFA  | MARCHAND: Intégration / Compte de test       | Copie de CEC          |

    
   
   