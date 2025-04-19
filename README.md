# Gráf feladat generátor - backend

Ez a projekt egy webalapú alkalmazás, amely gráfelméleti feladatok generálására szolgál. Az alkalmazás célja, hogy támogassa a gráfelmélet tanítását és tanulását, valamint lehetőséget biztosítson egyedi feladatok gyors és egyszerű előállítására.

## Fő funkciók

- **Gráf létrehozása**: Személyreszabható gráfok generálása és elrendezése a Graphology könyvtár segítségével.
- **Feladatgenerálás**: Testreszabható szövegparaméterekkel rendelkező feladatok generálása.
- **PDF exportálás**: Feladatok exportálása PDF formátumban.

## Telepítés és futtatás

1. Klónozd a repót:

   ```bash
   git clone https://github.com/<felhasználónév>/task-generator-backend.git
   ```
2. Telepítsd a függőségeket:

   ```bash
   npm install
   ```
3. Hozz létre három mappát a projektmappa gyökerében a következő elnevezésekkel: generated_svg, generated_task_pdf és generated_solution_pdf. Ezek nélkül nem fog megfelelően működni az alkalmazás.
4. Indítsd el a fejlesztői szervert:

   ```bash
   npm run dev
   ```

## Környezeti változók

Hozz létre egy `.env` fájlt a gyökérkönyvtárban, és add meg a következő változót:

```
NEXT_PUBLIC_FRONTEND=<frontend_url>
```

### SVG generálása

- **URL**: `/api/generate-svg`
- **Módszer**: `POST`
- **Leírás**: SVG fájl generálása a megadott gráfparaméterek alapján.

### PDF generálása

- **URL**: `/api/generate-pdf`
- **Módszer**: `POST`
- **Leírás**: Feladat és megoldás PDF generálása a megadott paraméterek alapján.

## Technológiák

- **Node.js** és **Express.js**: A szerver alapja.
- **Graphology**: Gráfok generálására és kezelésére.
- **pdf-lib**: PDF fájlok létrehozására és módosítására.
- **Sharp**: SVG képek PNG formátumba konvertálására.
- **TypeScript**: A kód minőségének és karbantarthatóságának javítására.

## Licenc

Ez a projekt az Apache License licenc alatt érhető el. További részletekért lásd a [LICENSE](LICENSE) fájlt.
