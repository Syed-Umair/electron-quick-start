onload = () => {
    document.querySelector('webview').addEventListener('did-stop-loading', (e) => {
        function executeScript() {
            try {
                function setupChecker() {
                    console.debug('Starting Spell Check module !!! ');
                    let spellCheckHandler = null;
                    if (!window.electronSpellCheckHandler) {
                        let Checker = require('electron-spellchecker').SpellCheckHandler;
                        spellCheckHandler = new Checker();
                    } else {
                        spellCheckHandler = window.electronSpellCheckHandler;
                    }
                    let frame = require('electron').webFrame;
                    spellCheckHandler.automaticallyIdentifyLanguages = false;
                    spellCheckHandler.switchLanguage('en-US'); // It returns promise. So, We await the language switch
                    frame.setSpellCheckProvider("en-US", {
                        spellCheck (words, callback) {
                          setTimeout(() => {
                            const misspelled = words.filter(text => spellCheckHandler.isMisspelled(text))
                            callback(misspelled)
                          }, 0)
                        }
                    });
                    window.electronSpellCheckHandler = spellCheckHandler;
                }
                setTimeout(setupChecker, 5000);
            } catch (e) {
                console.error('Failed to setup spellchecker', e);
            }
        }
        document.querySelector('webview').executeJavaScript('(' + executeScript.toString() + ')();', false);
    });
};
