"""
Script pour corriger le notebook NER_spaCy.ipynb
Corrige les erreurs E022 en modifiant la fonction de conversion et l'entraînement
"""

import json
import sys

def fix_notebook():
    notebook_path = r"c:\Users\hp\OneDrive\Bureau\NLP\ner-multiconer\notebook\NER_spaCy.ipynb"
    
    # Lire le notebook
    print("📖 Lecture du notebook...")
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = json.load(f)
    
    # Nouveau code pour la fonction conll_to_spacy_format (cellule #VSC-cdd25c11)
    new_conversion_code = '''def conll_to_spacy_format(conll_file):
    """
    Convertit un fichier CoNLL au format spaCy v3 avec TOUTES les phrases.
    
    CORRECTION MAJEURE: Inclut toutes les phrases (avec et sans entités)
    pour que spaCy apprenne correctement les transitions 'O'.
    """
    training_data = []
    current_tokens = []
    current_labels = []
    
    with open(conll_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            if line.startswith('#'):  # Ignorer commentaires
                continue
            
            if not line:  # Fin de phrase
                if current_tokens:
                    # Construire le texte avec espaces
                    text = ' '.join(current_tokens)
                    
                    # Calculer les offsets exacts pour chaque token
                    token_starts = []
                    token_ends = []
                    current_pos = 0
                    
                    for token in current_tokens:
                        token_starts.append(current_pos)
                        token_ends.append(current_pos + len(token))
                        current_pos += len(token) + 1  # +1 pour l'espace
                    
                    # Construire les entités avec offsets corrects
                    valid_entities = []
                    i = 0
                    while i < len(current_labels):
                        label = current_labels[i]
                        
                        if label.startswith('B-'):
                            entity_type = label[2:]
                            start_idx = i
                            end_idx = i + 1
                            
                            # Étendre l'entité avec les I- suivants
                            while end_idx < len(current_labels) and current_labels[end_idx] == f'I-{entity_type}':
                                end_idx += 1
                            
                            # Ajouter l'entité avec les bons offsets
                            char_start = token_starts[start_idx]
                            char_end = token_ends[end_idx - 1]
                            valid_entities.append((char_start, char_end, entity_type))
                            
                            i = end_idx
                        else:
                            i += 1
                    
                    # CORRECTION: Ajouter TOUTES les phrases (avec ou sans entités)
                    training_data.append((text, {"entities": valid_entities}))
                    
                    # Réinitialiser pour la prochaine phrase
                    current_tokens = []
                    current_labels = []
            else:
                parts = line.split()
                if len(parts) >= 2:
                    token = parts[0]
                    label = parts[1]
                    current_tokens.append(token)
                    current_labels.append(label)
        
        # Traiter la dernière phrase si nécessaire
        if current_tokens:
            text = ' '.join(current_tokens)
            
            token_starts = []
            token_ends = []
            current_pos = 0
            
            for token in current_tokens:
                token_starts.append(current_pos)
                token_ends.append(current_pos + len(token))
                current_pos += len(token) + 1
            
            valid_entities = []
            i = 0
            while i < len(current_labels):
                label = current_labels[i]
                
                if label.startswith('B-'):
                    entity_type = label[2:]
                    start_idx = i
                    end_idx = i + 1
                    
                    while end_idx < len(current_labels) and current_labels[end_idx] == f'I-{entity_type}':
                        end_idx += 1
                    
                    char_start = token_starts[start_idx]
                    char_end = token_ends[end_idx - 1]
                    valid_entities.append((char_start, char_end, entity_type))
                    
                    i = end_idx
                else:
                    i += 1
            
            training_data.append((text, {"entities": valid_entities}))
    
    print(f"✅ {len(training_data)} phrases converties (avec et sans entités)")
    
    # Afficher statistiques
    with_entities = sum(1 for _, annot in training_data if len(annot["entities"]) > 0)
    without_entities = len(training_data) - with_entities
    print(f"   - {with_entities} phrases avec entités")
    print(f"   - {without_entities} phrases sans entités (importantes pour apprendre 'O')")
    
    return training_data'''
    
    # Nouveau code pour l'entraînement (cellule #VSC-1d1b2071)
    new_training_code = '''# Configuration de l'entraînement avec spaCy v3
n_epochs = 30
batch_size = 16
drop = 0.2

# Fonction pour créer des exemples spaCy v3
def get_examples(nlp, training_data):
    """Convertit les données au format Example pour spaCy v3"""
    examples = []
    for text, annots in training_data:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annots)
        examples.append(example)
    return examples

# CORRECTION MAJEURE: Initialiser le modèle avec nlp.initialize()
print("🔧 Initialisation du modèle NER avec les exemples...")
examples = get_examples(nlp, train_data)
nlp.initialize(lambda: examples)  # spaCy v3 requiert cette initialisation

# Créer l'optimiseur APRÈS l'initialisation
optimizer = nlp.create_optimizer()

print("\\n🚀 Début de l'entraînement...")
print(f"📊 Paramètres: {n_epochs} epochs, batch_size={batch_size}, dropout={drop}")

losses_history = []

for epoch in range(n_epochs):
    # Mélanger les données
    random.shuffle(train_data)
    losses = {}
    
    # Entraîner par mini-batches
    batches = minibatch(examples, size=batch_size)
    
    for batch in batches:
        nlp.update(
            batch,
            drop=drop,
            sgd=optimizer,
            losses=losses
        )
    
    # Enregistrer la perte
    current_loss = losses.get('ner', 0)
    losses_history.append(current_loss)
    
    # Afficher progression
    if (epoch + 1) % 5 == 0 or epoch == 0:
        print(f"Epoch {epoch + 1}/{n_epochs} - Loss: {current_loss:.4f}")

print("\\n✅ Entraînement terminé!")'''
    
    # Parcourir les cellules et remplacer
    cells_modified = 0
    
    for i, cell in enumerate(notebook['cells']):
        # Vérifier les métadonnées de la cellule
        cell_id = cell.get('metadata', {}).get('id', '')
        
        # Remplacer la cellule de conversion
        if cell_id == 'VSC-cdd25c11' or (cell.get('cell_type') == 'code' and 
                                         'def conll_to_spacy_format' in ''.join(cell.get('source', []))):
            print(f"🔧 Correction de la cellule de conversion (index {i})...")
            cell['source'] = [line + '\n' for line in new_conversion_code.split('\n')]
            if not cell['source'][-1].endswith('\n'):
                cell['source'][-1] = cell['source'][-1].rstrip('\n')
            cells_modified += 1
        
        # Remplacer la cellule d'entraînement
        elif cell_id == 'VSC-1d1b2071' or (cell.get('cell_type') == 'code' and 
                                            'n_epochs' in ''.join(cell.get('source', [])) and
                                            'nlp.update' in ''.join(cell.get('source', []))):
            print(f"🔧 Correction de la cellule d'entraînement (index {i})...")
            cell['source'] = [line + '\n' for line in new_training_code.split('\n')]
            if not cell['source'][-1].endswith('\n'):
                cell['source'][-1] = cell['source'][-1].rstrip('\n')
            cells_modified += 1
    
    if cells_modified == 0:
        print("❌ Aucune cellule n'a été modifiée. Vérifiez les IDs.")
        return False
    
    # Sauvegarder le notebook corrigé
    print(f"💾 Sauvegarde du notebook ({cells_modified} cellules modifiées)...")
    with open(notebook_path, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, ensure_ascii=False, indent=1)
    
    print(f"✅ Notebook corrigé avec succès!")
    print(f"   Fichier: {notebook_path}")
    print(f"   Modifications: {cells_modified} cellules")
    print("\\n📝 Prochaines étapes:")
    print("   1. Ouvrir le notebook dans VS Code")
    print("   2. Recharger le notebook (Ctrl+Shift+P > Reload Notebook)")
    print("   3. Exécuter les cellules modifiées")
    
    return True

if __name__ == "__main__":
    try:
        success = fix_notebook()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
