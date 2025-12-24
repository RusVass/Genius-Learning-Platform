# Geometry Utils (Mocha + Chai)

Невеликий приклад проєкту на Node.js з утилітами для прямокутників/квадратів і тестами на Mocha + Chai.

## Вміст
- `src/app.js` — функції `calcArea`, `calcPerimeter`, `isSquare`.
- `test/app.test.js` — тести (у т.ч. кейси з нульовою стороною та дробами).
- `package.json` — скрипти для запуску тестів і дебагу.
- `.vscode/launch.json` — конфігурації для запуску/attach у дебагері.

## Встановлення
```bash
npm install
```

## Скрипти
- `npm test` — одноразовий прогін тестів Mocha.
- `npm run test:watch` — автоперезапуск тестів при зміні файлів.
- `npm run test:debug` — запуск тестів з `--inspect-brk` (порт 9229) для підключення дебагера.

## Дебаг
Варіант 1: Attach до вже запущеного `npm run test:debug`
- У VS Code/Cursor обрати конфіг `Attach to Mocha (9229)` і натиснути Start Debugging.

Варіант 2: Запуск тестів під дебагером з IDE
- Обрати конфіг `Mocha Tests` і Start Debugging — тести стартують одразу в дебаг-сесії.

Ставте breakpoint’и у `test/app.test.js` або `src/app.js`, далі Continue/F5.

## Структура
```
src/
  app.js
test/
  app.test.js
.vscode/
  launch.json
package.json
```

## Функції
- `calcArea(length, width)`: площа прямокутника.
- `calcPerimeter(length, width)`: периметр.
- `isSquare(length, width)`: чи є фігура квадратом.

## Примітки
- Проєкт у режимі ECMAScript modules (`"type": "module"`).
- Тести використовують Chai `expect` і Mocha (BDD).***

