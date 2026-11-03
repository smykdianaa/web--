/**
 * Лабораторна робота: Аналіз показників акустичного моніторингу
 * Файл: js/monitoring.js
 */

// ==========================================
// 1. ВИХІДНІ ДАНІ ТА НАЛАШТУВАННЯ
// ==========================================
const noiseLevels = [
    42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
    53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
    79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;


// ==========================================
// 2. ДЕКОМПОЗИЦІЯ ТА ФУНКЦІЇ (РІЗНІ ФОРМИ)
// ==========================================

// ------------------------------------------
// 2.1 Arrow Functions (Стрілкові функції)
// ------------------------------------------

// Стрілкова функція з кількома параметрами (перевірка валідності)
const isValidLevel = (level, min = minValidLevel, max = maxValidLevel) => 
    Number.isFinite(level) && level >= min && level <= max;

// Стрілкова функція з одним параметром (форматування підпису)
const formatDb = value => `${value} dB`;

// Стрілкова функція для порівняння з порогом
const isAboveThreshold = (level, threshold) => level > threshold;


// ------------------------------------------
// 2.2 Function Declaration (Оголошення функції)
// ------------------------------------------

/**
 * Знаходить перше критичне вимірювання за допомогою циклу for.
 * Демонструє Hoisting: може бути викликана ДО її оголошення у коді.
 */
function findFirstCritical(levels, criticalThresh, minVal, maxVal) {
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        if (isValidLevel(level, minVal, maxVal) && level > criticalThresh) {
            return {
                value: level,
                position: i + 1 // Позиція для людини (індекс + 1)
            };
        }
    }
    return null;
}


// ------------------------------------------
// 2.3 Function Expression (Функціональний вираз)
// ------------------------------------------

/**
 * Підраховує розподіл вимірювань за категоріями та збирає список некоректних.
 */
const countByCategory = function(levels, warnThresh, critThresh, minVal, maxVal) {
    let normalCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let validCount = 0;
    let validSum = 0;
    const invalidItems = [];

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        
        if (!isValidLevel(level, minVal, maxVal)) {
            invalidItems.push({ value: level, position: i + 1 });
            continue;
        }

        validCount++;
        validSum += level;

        if (level <= warnThresh) {
            normalCount++;
        } else if (level <= critThresh) {
            warningCount++;
        } else {
            criticalCount++;
        }
    }

    return {
        validCount,
        validSum,
        normalCount,
        warningCount,
        criticalCount,
        invalidItems
    };
};


// ------------------------------------------
// 2.4 Допоміжні функції аналізу
// ------------------------------------------

/**
 * Обчислення середнього, мінімуму та максимуму (цикл for...of).
 */
function calculateStats(levels, minVal, maxVal) {
    let sum = 0;
    let count = 0;
    let min = null;
    let max = null;

    for (const level of levels) {
        if (!isValidLevel(level, minVal, maxVal)) {
            continue;
        }

        sum += level;
        count++;

        if (min === null || level < min) {
            min = level;
        }
        if (max === null || level > max) {
            max = level;
        }
    }

    const average = count > 0 ? sum / count : null;
    return { average, min, max };
}

/**
 * Пошук відновлення (3 безпечні вимірювання <= warningLevel поспіль після критичного).
 * Використовує цикл while.
 */
function findRecovery(levels, startIndex, warnThresh, minVal, maxVal) {
    if (startIndex === null || startIndex >= levels.length) {
        return null;
    }

    let currentIndex = startIndex; 
    let safeConsecutiveCount = 0;

    while (currentIndex < levels.length) {
        const level = levels[currentIndex];

        if (isValidLevel(level, minVal, maxVal) && level <= warnThresh) {
            safeConsecutiveCount++;
            if (safeConsecutiveCount === 3) {
                return {
                    value: level,
                    position: currentIndex + 1
                };
            }
        } else {
            safeConsecutiveCount = 0;
        }

        currentIndex++;
    }

    return null;
}

/**
 * Демонстрація виконання do...while: пошук першого коректного вимірювання.
 */
function findFirstValidDoWhile(levels, minVal, maxVal) {
    if (!levels || levels.length === 0) {
        return null;
    }

    let i = 0;
    do {
        if (isValidLevel(levels[i], minVal, maxVal)) {
            return { value: levels[i], position: i + 1 };
        }
        i++;
    } while (i < levels.length);

    return null;
}


// ==========================================
// 3. ЕКСПЕРИМЕНТИ З HOISTING (ДЛЯ ЗАХИСТУ)
// ==========================================

console.log("%c--- Експеримент з Hoisting ---", "color: #166534; font-weight: bold;");

// Function Declaration працює до її оголошення у коді:
const earlyCriticalCheck = findFirstCritical([80, 90], warningLevel, minValidLevel, maxValidLevel);
console.log("Успішний виклик Function Declaration до оголошення у коді:", earlyCriticalCheck);


// ==========================================
// 4. ГЕНЕРАЦІЯ ТА ВИВЕДЕННЯ КОНСОЛЬНОГО ЗВІТУ
// ==========================================

function generateMonitoringReport(data, warnLvl, critLvl, minLvl, maxLvl) {
    const totalCount = data.length;
    
    const categories = countByCategory(data, warnLvl, critLvl, minLvl, maxLvl);
    const stats = calculateStats(data, minLvl, maxLvl);
    const firstCritical = findFirstCritical(data, critLvl, minLvl, maxLvl);
    
    const startIndexForRecovery = firstCritical ? firstCritical.position : null;
    const recovery = findRecovery(data, startIndexForRecovery, warnLvl, minLvl, maxLvl);

    const totalExceededWarn = categories.warningCount + categories.criticalCount;

    console.group("Акустична варта -- звіт моніторингу");
    
    console.log(`Пороги: попередження > ${warnLvl} dB; критичний рівень > ${critLvl} dB`);
    console.log(`Усього вимірювань: ${totalCount}`);
    console.log(`Коректних: ${categories.validCount}`);
    console.log(`Некоректних: ${categories.invalidItems.length}`);
    
    console.table([
        { "Категорія": "Без перевищення", "Кількість": categories.normalCount },
        { "Категорія": "Попередження", "Кількість": categories.warningCount },
        { "Категорія": "Критичні", "Кількість": categories.criticalCount }
    ]);

    const formattedAvg = stats.average !== null ? stats.average.toFixed(2).replace('.', ',') : "N/A";
    console.log(`Середній рівень: ${formattedAvg} dB`);
    console.log(`Мінімальний рівень: ${stats.min !== null ? formatDb(stats.min) : "N/A"}`);
    console.log(`Максимальний рівень: ${stats.max !== null ? formatDb(stats.max) : "N/A"}`);
    
    if (firstCritical) {
        console.log(`Перше критичне вимірювання: ${formatDb(firstCritical.value)}, позиція ${firstCritical.position}`);
    } else {
        console.log("Перше критичне вимірювання: не зафіксовано");
    }

    if (recovery) {
        console.log(`Відновлення -- три безпечні вимірювання поспіль: зафіксовано на позиції ${recovery.position} (${formatDb(recovery.value)})`);
    } else {
        console.log("Відновлення -- три безпечні вимірювання поспіль: не знайдено");
    }

    console.warn(`Поріг ${warnLvl} dB перевищено у ${totalExceededWarn} вимірюваннях.`);

    if (categories.invalidItems.length > 0) {
        const invalidText = categories.invalidItems
            .map(item => `позиція ${item.position} (${item.value} dB)`)
            .join(', ');
        console.error(`Некоректні дані: ${invalidText}.`);
    }

    let conclusion = `Висновок: зафіксовано ${categories.criticalCount} критичні вимірювання; `;
    if (categories.criticalCount > 0) {
        conclusion += recovery 
            ? `після першого з них відновлення зафіксовано на позиції ${recovery.position}.`
            : `після першого з них стійкого відновлення не виявлено.`;
    } else {
        conclusion += `критичних відхилень не виявлено.`;
    }
    console.log(conclusion);

    console.groupEnd();
}

// Запуск основного звіту
generateMonitoringReport(noiseLevels, warningLevel, criticalLevel, minValidLevel, maxValidLevel);


// ==========================================
// 5. ТЕСТУВАННЯ НА ОКРЕМИХ НАБОРАХ ДАНИХ
// ==========================================

console.log("\n%c--- Тестування граничних варіантів ---", "color: #1e293b; font-weight: bold;");

// Тест 1: Порожній масив []
console.log("%cТест 1: Порожній масив []", "color: #6b7280;");
generateMonitoringReport([], warningLevel, criticalLevel, minValidLevel, maxValidLevel);

// Тест 2: Некоректні дані [-1, 141]
console.log("%cТест 2: Некоректні дані [-1, 141]", "color: #6b7280;");
generateMonitoringReport([-1, 141], warningLevel, criticalLevel, minValidLevel, maxValidLevel);

// Тест 3: Межові значення [70, 85, 86]
console.log("%cТест 3: Значення на межах категорій [70, 85, 86]", "color: #6b7280;");
generateMonitoringReport([70, 85, 86], warningLevel, criticalLevel, minValidLevel, maxValidLevel);