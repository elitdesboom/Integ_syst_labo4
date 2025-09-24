/**
 * @file     cmd-validation.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Script de validation pour le formulaire de commande de pizza
 */

document.addEventListener('DOMContentLoaded', function () {
  // quantité : bloquer lettres / coller non numériques / roulette
  const qty = document.getElementById('quantity');
  if (qty)
  {
    qty.setAttribute('inputmode','numeric');
    qty.addEventListener('keypress', e => { if (!/\d/.test(e.key)) e.preventDefault(); });
    qty.addEventListener('paste', e => 
    {
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^\d+$/.test(paste)) e.preventDefault();
    });
    qty.addEventListener('wheel', e => e.preventDefault(), { passive: false });
  }

  // empêcher chiffres dans les champs prénom/nom
  const nameInput = document.getElementById('name');
  const surnameInput = document.getElementById('surname');
  function blockDigits(e) 
  {
    // autorise lettres accentuées, espaces, -, '
    if (!/^[\p{L}\s'\-]$/u.test(e.key)) e.preventDefault();
  }

  //Entrée dans le case prénom
  if (nameInput) 
  {
    nameInput.addEventListener('keypress', blockDigits); //bloque écriture chiffre
    nameInput.addEventListener('paste', e =>
    {
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/.test(paste)) e.preventDefault(); //Regarde les caractères illégaux avant de copier coller
    });
  }

  
  if (surnameInput) //Si entrée d'un prénom dans le case nom
  {
    surnameInput.addEventListener('keypress', blockDigits); //Bloque les chiffres
    surnameInput.addEventListener('paste', e => {
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/.test(paste)) e.preventDefault();
    });
  }

  // empêcher lettres dans téléphone (laisser chiffres, -, (), espace)
  const phone = document.getElementById('phone');
  if (phone) 
  {
    phone.addEventListener('keypress', e => { if (!/[\d\-\(\)\s]/.test(e.key)) e.preventDefault(); });
    phone.addEventListener('paste', e => {
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^[\d\-\(\)\s]+$/.test(paste)) e.preventDefault();
    });
  }

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
        let msg = '';
        switch (field) 
        {
          case 'pizzaType':
            msg = 'Veuillez choisir une pizza.';
            const fb = document.getElementById('pizzaTypeFeedback');
            if (fb) { fb.textContent = msg; fb.style.display = 'block'; }
            break;
          case 'quantity':
            msg = 'Quantité : entier entre 1 et 99. Ex : 2';
            break;
          case 'size':
            msg = 'Taille : choisissez Small, Medium ou Large.';
            break;
          case 'address':
            msg = 'Adresse : champ requis.';
            break;
          case 'postalCode':
            msg = 'Code postal : format valide A1A 1A1 (ex : H2X 1Y4).';
            break;
          case 'phone':
            msg = 'Téléphone : format valide ex. 514-123-4567 (chiffres, -, (), espaces).';
            break;
          case 'email':
            msg = 'Courriel : format valide ex. nom@domaine.com.';
            break;
          case 'name':
            msg = 'Prénom : lettres seulement (ex : Éliott).';
            break;
          case 'surname':
            msg = 'Nom : lettres seulement (ex : Desbordes).';
            break;
          case 'payment':
            msg = 'Paiement : choisissez un mode de paiement.';
            break;
          default:
            msg = 'Champ invalide.';
        }

        //Afficher le feedback sous le champ (si présent)
        let feedback = null;
        if (field === 'pizzaType') 
        {
          feedback = document.getElementById('pizzaTypeFeedback');
        } 
        else 
        {
          feedback = el.closest('.mb-3')?.querySelector('.invalid-feedback') || el.parentElement?.querySelector('.invalid-feedback');
        }

        if (feedback) 
        {
          feedback.textContent = msg;
          feedback.style.display = 'block';
        }

        if (el.classList) el.classList.add('is-invalid');
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