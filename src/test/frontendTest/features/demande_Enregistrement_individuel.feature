Feature: Demande enregistrement individuel

@demandeEi
  Scenario: Effectuer une demande enregistrement individuel  et payer en ligne
    Given Le citoyen est connecté avec une session utilisateur existante
    When  Le citoyen clique sur le lien "e-services"
    And Le citoyen clique sur le service "Enregistrement individuelProc"
    And Le citoyen clique sur le bouton "j'ai compris"
    And Le citoyen saisit le nom partiel du géomètre "<nomPartiel>"
    ##And Le citoyen sélectionne le geometre "<nomPartiel>"
    
    When Le citoyen les téléverse les fichiers suivants:
  | FP PAPA DOMETO Alphonse.pdf     |
  | casierjudiciaire.pdf            |
  | Recu_de_paiement.pdf            |
  | Capture.png                     |
  | Capture1.jpg                    |

    
    And Le citoyen doit cliquer sur le bouton "<boutonEnregistrer>"
    Then la notification "<notificationTexte>" s'affiche

  Examples:
     | nomPartiel         | boutonEnregistrer        | notificationTexte |
     | Raphaël ADELAKOUN  |  Enregistrer la demande | Notification      |
                   
                     