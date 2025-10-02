/**
 * @file     cmd-validation.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Script de validation pour le formulaire de commande de pizza
 */

document.addEventListener('DOMContentLoaded', function () {
  
  function addInputValidation(elementId, regexKeypress, regexPaste) {
    const input = document.getElementById(elementId);
    if(input) {
      input.addEventListener('keypress', function(e) {
        if(!regexKeypress.test(e.key)) {
          e.preventDefault();
        }
      });
      input.addEventListener('paste', function(e) {
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        if(!regexPaste.test(paste)) {
          e.preventDefault();
        }
      });
    }
 }

   // Fonction pour obtenir les messages d'erreur
  function getErrorMessage(fieldName) {
    const messages = {
      'pizzaType': 'Veuillez choisir une pizza.',
      'quantity': 'Quantité : entier entre 1 et 99. Ex : 2',
      'size': 'Taille : choisissez Small, Medium ou Large.',
      'address': 'Adresse : champ requis.',
      'postalCode': 'Code postal : format valide A1A 1A1 (ex : H2X 1Y4).',
      'phone': 'Téléphone : format valide ex. 514-123-4567 (chiffres, -, (), espaces).',
      'email': 'Courriel : format valide ex. nom@domaine.com.',
      'name': 'Prénom : lettres seulement (ex : Éliott).',
      'surname': 'Nom : lettres seulement (ex : Desbordes).',
      'payment': 'Paiement : choisissez un mode de paiement.'
    };
    return messages[fieldName] || 'Champ invalide.';
  }

  // Fonction pour afficher les erreurs
  function displayError(element, message) {
    const field = element.name || element.id || '';
    let feedback = null;

    if(field === 'pizzaType') {
      feedback = document.getElementById('pizzaTypeFeedback');
    }
    else {
      feedback = element.closest('.mb-3')?.querySelector('.invalid-feedback') || element.parentElement?.querySelector('.invalid-feedback');

    }

    if(feedback) {
      feedback.textContent= message;
      feedback.style.display = 'block';
    }

    if(element.classList) {
      element.classList.add('is-invalid');
    }
  }

  //Quantité : bloquer lettres, copier coller non numériques et roulette souris
  addInputValidation('quantity', /\d/, /^\d+$/);
  const qty = document.getElementById('quantity');
  if (qty) {
    qty.setAttribute('inputmode','numeric');
    qty.addEventListener('wheel', function(e) {e.preventDefault();}, { passive: false });
  }

  // empêcher chiffres dans les champs prénom/nom
  addInputValidation('name', /^[\p{L}\s'\-]$/u, /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/);
  addInputValidation('surname', /^[\p{L}\s'\-]$/u, /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/);

// empêcher lettres dans téléphone (laisser chiffres, -, (), espace)
  addInputValidation('phone', /[\d\-\(\)\s]/, /^[\d\-\(\)\s]+$/);

  const form = document.getElementById('orderForm');
  if (!form) return;

  function showSimpleAlert(message) //Affichage du bandeau d'alerte
  {
    removeAlert();
    const div = document.createElement('div');
    div.id = 'formAlert';
    div.className = 'alert alert-danger alert-dismissible fade show';
    div.role = 'alert';
    div.innerHTML = message +
      ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    form.parentNode.insertBefore(div, form);
  }

  function removeAlert()
  {
    const ex = document.getElementById('formAlert');
    if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
  }

  // radios pizzaType : enlever le message d'erreur si on change de sélection
  const radios = Array.from(form.querySelectorAll('input[name="pizzaType"]'));
  radios.forEach(r => r.addEventListener('change', function(){
    const fb = document.getElementById('pizzaTypeFeedback');
    if (fb) fb.style.display = 'none';
    radios.forEach(rr => rr.classList.remove('is-invalid'));
    removeAlert();
  }));

  form.addEventListener('submit', function(ev)
  {
    // reset des effets visuel quand on valide la commande
    form.querySelectorAll('.is-invalid').forEach(el=>el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(fb=>fb.style.display='none');
    removeAlert();

    const pizzaChecked = form.querySelector('input[name="pizzaType"]:checked');
    if (!pizzaChecked) 
    {
      const fb = document.getElementById('pizzaTypeFeedback');
      if (fb) fb.style.display = 'block';
    }

    const invalidEls = Array.from(form.elements).filter(el => !el.checkValidity());
    if (!pizzaChecked) 
    {
      const firstRadio = form.querySelector('input[name="pizzaType"]');
      if (firstRadio) invalidEls.push(firstRadio);
    }

    if (invalidEls.length) 
    {
      ev.preventDefault();
      ev.stopPropagation();

      // pour chaque champ invalide : définir le message sous le champ + marquer en rouge
      invalidEls.forEach(el => {
        const field = el.name || el.id || '';
        const message = getErrorMessage(field);
        displayError(el, message);
      });

      showSimpleAlert('Certains champs sont non conformes. Corrigez les champs en surbrillance.');

      const first = invalidEls.find(Boolean);
      if (first) first.focus();
      return false;
    }

    // Si tout est ok: permet le submit
    return true;
  }, false);

  //Supression des message d'erreur quand on corriges les entrées
  form.addEventListener('input', function(e)
  {
    const el = e.target;
    if (el.classList && el.classList.contains('is-invalid') && el.checkValidity()) 
    {
      el.classList.remove('is-invalid');
      const fb = el.closest('.mb-3')?.querySelector('.invalid-feedback') || el.parentElement?.querySelector('.invalid-feedback');
      if (fb) fb.style.display = 'none';
      removeAlert();
    }
  }, true);
});