# Executar i depurar a VS Code amb launch.json

El codi es pot executar i depurar a VS Code. Per iniciar l'execució o la
depuració de l'aplicació web mitjançant, iniciarem l'execució de l'aplicació
web des de la consola:

```shell
npm run start
```

Passos per depurar l'aplicació web:

1. Obre la pestanya `Run and Debug` de VS Code.
2. Seleccioneu `Depurar a Chrome` a la llista desplegable superior.
3. Premeu F5 per iniciar la depuració o el botó que hi ha al costat de la llista desplegable superior.

Passos recomanats en la depuració:

1. Afegeix breakpoints al marge esquerre al codi JavaScript que vulguis depurar.
2. Intenta assolir l'acció que vols depurar interactuant amb la pàgina web al navegador.
3. Utilitza els controls de depuració:
   - Continue (F5)
   - Step Over (F10)
   - Step Into (F11)
   - Step Out (Shift+F11)
4. Revisa el valor de les variables al plafó `VARIABLES` o al plafó `DEBUG CONSOLE`.

![imatge de depuració](doc/debug.avif)