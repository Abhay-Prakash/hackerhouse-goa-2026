import os

emojis_to_remove = [
    '🧠', '💻', '🚀', '🎨', '🔌', '📡', '🌐', '🔗', '⚙️', '⚡', '🧪', '🖌️', '⛓️', '📱', '💾', '🏗️', '🗺️',
    '🤠', '🌴', '🏖️', '💎', '🎁', '🏄', '🛖', '🔒', '📷', '✨', '⚠️', '❌', '🔍', '📦', '🗺️', '🏄‍♂️', '🔧'
]

files_to_clean = [
    'components/journey/GamifiedTreasureJourney.tsx',
    'app/card/[id]/CardSharePage.tsx',
    'app/card/[id]/page.tsx',
    'app/layout.tsx',
    'components/card/BuilderCardFront.tsx',
]

base_dir = r'd:\AIML\Id_Card\hackerhousegoa'

for rel_path in files_to_clean:
    path = os.path.join(base_dir, rel_path)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for emoji in emojis_to_remove:
            content = content.replace(emoji, '')
            # Also replace with space if it was prepended/appended with space, to avoid double spaces.
            content = content.replace('  ', ' ')
        
        if original != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {rel_path}")
