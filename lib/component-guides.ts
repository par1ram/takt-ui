import type { Entry } from "./catalog";

type Guide = {
  behavior: string;
  related?: Entry["slug"][];
  example?: string;
};

const guides: Record<Entry["slug"], Guide> = {
  "chat-composer": {
    behavior: "Без onSend форма показывает локальное подтверждение. Для отправки верните Promise из onSend. Пока он выполняется, редактор блокирует повторную отправку. При успехе он очищает текст, при ошибке сохраняет его для повтора. В управляемом режиме передайте value и onChange вместе. Пример ожидает POST /api/messages в вашем приложении.",
    related: ["message-thread", "course-messenger", "prompt-box"],
    example: `"use client";

import { useState } from "react";
import { ChatComposer } from "@/components/ui/chat-composer";

export default function TeamMessage() {
  const [draft, setDraft] = useState("");

  async function send(text: string) {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
  }

  return <ChatComposer value={draft} onChange={setDraft} onSend={send} />;
}`,
  },
  "chat-post": {
    behavior: "Передайте post с автором, временем и текстом. Поля code и resource добавляют фрагмент кода и ссылку. Через children можно подставить действия или реакции под сообщением.",
    related: ["message-reactions", "message-thread"],
  },
  "message-thread": {
    behavior: "Передайте parent и replies из приложения. При управляемом списке добавляйте ответ в источник данных после onReply. Пара draft и onDraftChange сохраняет черновик при переключении веток.",
    related: ["chat-post", "chat-composer", "course-messenger"],
  },
  "course-messenger": {
    behavior: "initialMessages задаёт начальные данные локального режима. Для синхронизации с сервером передайте messages по ID канала, сохраняйте ответы через onSend и обновляйте reactions через onToggleReaction. Третий аргумент onSend указывает родительское сообщение в ветке.",
    related: ["channel-list", "chat-post", "chat-composer", "message-reactions", "message-thread"],
  },
  "command-search": {
    behavior: "onSearch получает строку запроса. Маршрут и результаты поиска определяет приложение. Если приложение уже обрабатывает Ctrl/⌘+K, передайте shortcut={false}.",
    related: ["command-palette", "springy-input"],
  },
  "command-palette": {
    behavior: "Передайте названия действий в commands. onExecute получает выбранное название после подтверждения. Список фильтруется внутри диалога.",
    related: ["command-search", "command-button"],
  },
  "receipt-printer": {
    behavior: "Без onPay используется демонстрационная оплата. Передайте order.amount в основных единицах валюты. Возвращайте { orderId } из onPay после подтверждения на сервере. Отклонённый Promise позволяет повторить оплату. Повторная печать использует сохранённый чек.",
    related: ["card-field"],
  },
  "card-field": {
    behavior: "В режиме demo onChange получает тестовые цифры. Для mode=\"payment\" разместите компонент внутри настроенного Stripe Elements на HTTPS и используйте onCompleteChange для состояния заполнения.",
    related: ["receipt-printer"],
  },
  "latency-chart": {
    behavior: "Передайте samples в хронологическом порядке. null означает отсутствие замера, а 0 отображается как измеренное значение.",
    related: ["conversion-funnel", "cohort-retention"],
  },
  "conversion-funnel": {
    behavior: "Порядок stages задаёт последовательность воронки. Каждый count — число участников этапа.",
    related: ["cohort-retention", "latency-chart"],
  },
  "cohort-retention": {
    behavior: "size задаёт размер когорты. В retained передайте число вернувшихся по каждому периоду. null обозначает будущий или неизмеренный период.",
    related: ["conversion-funnel", "latency-chart"],
  },
  "invite-people": {
    behavior: "Передайте участников в members. onInvite получает нормализованный email. При отклонении Promise форма сохраняет адрес для повторной попытки.",
  },
  "focus-mode": {
    behavior: "minutes задаёт продолжительность сессии. Синхронизируйте внешние уведомления через onChange, который сообщает о включении и завершении режима.",
  },
  "swipe-deck": {
    behavior: "Передайте cards в порядке показа. onSwipe получает саму карточку и направление left или right.",
  },
  "glass-player": {
    behavior: "Укажите в src доступный браузеру аудиофайл, а в cover — изображение. Путь /audio/intro.mp3 в примере замените адресом своей записи.",
  },
  "stat-card": {
    behavior: "Передайте две серии чисел в daily и weekly. Карточка управляет выбранным периодом и точкой серии.",
    related: ["latency-chart"],
  },
  "magnetic-button": {
    behavior: "children задаёт подпись кнопки. Передайте действие в onClick из клиентского компонента.",
  },
  "plan-switch": {
    behavior: "Каждому элементу options соответствует объект prices с той же позицией. onChange возвращает индекс выбранного периода.",
  },
  "wave-slider": {
    behavior: "Уровень задаётся числом от 0 до 100. Используйте defaultValue для начального значения или value вместе с onValueChange для внешнего управления.",
    related: ["jelly-slider", "detent-dial"],
  },
  "flip-counter": {
    behavior: "min и max ограничивают счётчик. defaultValue задаёт начальное число, а onValueChange передаёт следующее значение.",
  },
  "hold-button": {
    behavior: "duration и resetAfter задаются в миллисекундах. Привяжите действие к onConfirm, который срабатывает после завершённого удержания.",
    related: ["slide-to-confirm", "hold-to-publish"],
  },
  "spring-dock": {
    behavior: "Для каждого пункта передайте label и компонент иконки Lucide. onChange возвращает индекс пункта. Собирайте список иконок в клиентском компоненте.",
    related: ["rubber-dock"],
  },
  "file-drop": {
    behavior: "onFiles получает текущий список объектов File. Загрузку в хранилище выполняет приложение.",
    related: ["signature-pad"],
  },
  "rolling-text": {
    behavior: "Передайте непустой массив words в порядке смены надписей. При пустом массиве компонент ничего не отображает.",
    related: ["dynamic-text", "goo-morph"],
  },
  "spring-switch": {
    behavior: "Для локального переключателя задайте defaultChecked. Для настройки, которой владеет приложение, передайте checked и обновляйте его через onCheckedChange.",
    related: ["bell-button"],
  },
  "bloom-menu": {
    behavior: "actions содержит пары label и icon. Для запуска действия сопоставьте полученную в onSelect подпись с обработчиком приложения.",
  },
  "morph-tooltip": {
    behavior: "onAction сообщает bookmark, favorite или pin. Для первого действия также вызывается onClick, поэтому оформите побочный эффект в одном обработчике.",
  },
  "command-button": {
    behavior: "Задайте текст в label и передайте само действие в onExecute.",
    related: ["command-palette"],
  },
  "loading-success": {
    behavior: "Верните Promise из onRun. Компонент показывает ожидание, успех или возможность повтора по результату операции.",
  },
  "copy-button": {
    behavior: "В text передайте точную строку для буфера обмена. Компонент сам запрашивает запись и сообщает о её результате.",
  },
  "like-burst": {
    behavior: "likes задаёт базовое число отметок. onChange получает новый флаг liked для текущего пользователя.",
  },
  "slide-to-confirm": {
    behavior: "Передайте подтверждаемое действие в onConfirm. Компонент управляет прогрессом жеста и вызовом после подтверждения.",
    related: ["hold-button", "hold-to-publish"],
  },
  "cart-button": {
    behavior: "onAdd вызывается при увеличении количества, а onQuantityChange получает новое общее количество. Используйте второй обработчик для синхронизации корзины.",
  },
  "undo-button": {
    behavior: "Используйте onChange для обновления видимости записи. Значение true означает удаление, false — восстановление.",
  },
  "bell-button": {
    behavior: "onChange передаёт новое логическое состояние подписки. Сохранение настройки между сессиями выполняет приложение.",
    related: ["spring-switch"],
  },
  "unlock-face-id": {
    behavior: "Без status компонент моделирует сканирование. Для подключения своего механизма проверки запускайте его в onScan и передавайте фактическое состояние в status.",
    related: ["otp-code"],
  },
  "spring-dropdown": {
    behavior: "options содержит строки для показа. onSelect получает выбранную строку.",
  },
  "morph-island": {
    behavior: "title задаёт подпись звонка. onCall получает логический результат принятия или отклонения.",
  },
  "tab-pill": {
    behavior: "options и panels связаны по индексу. onChange получает индекс активной вкладки, начиная с нуля.",
    related: ["swipe-tabs", "segmented-control"],
  },
  "segmented-control": {
    behavior: "Передайте варианты в options. onChange сообщает индекс, по которому приложение может переключить набор данных или режим.",
    related: ["swipe-tabs", "tab-pill"],
  },
  "rubber-dock": {
    behavior: "onSelect передаёт индекс выбранной кнопки встроенной панели. Для собственного набора пунктов и иконок используйте Spring Dock.",
    related: ["spring-dock"],
  },
  "dynamic-menu": {
    behavior: "Передайте форматы в formats и подключите экспорт через onChoose. Обработчик получает название формата.",
  },
  "sidebar-collapse": {
    behavior: "items принимает пару названий. onSelect передаёт индекс для переключения представления приложения.",
  },
  "pagination-dots": {
    behavior: "pages задаёт количество страниц. onChange возвращает индекс с нуля. Для серверной пагинации преобразуйте его в принятую вашим API нумерацию.",
  },
  "step-progress": {
    behavior: "Порядок steps определяет последовательность. onChange сообщает индекс шага, который можно связать с содержимым формы.",
    related: ["agent-steps"],
  },
  "toolbar": {
    behavior: "text задаёт текст для предпросмотра. onChange возвращает список включённых стилей.",
  },
  "morph-popover": {
    behavior: "onSubmit получает текст и может вернуть Promise. При ошибке отправки отклоните Promise, чтобы форма показала состояние повтора.",
  },
  "letter-limit": {
    behavior: "limit задаёт максимальную длину. onChange получает уже ограниченный текст, который можно сохранить как значение поля.",
  },
  "springy-input": {
    behavior: "onChange вызывается при редактировании. Для запуска поиска передайте onSubmit, который получает запрос с удалёнными крайними пробелами.",
    related: ["command-search"],
  },
  "otp-code": {
    behavior: "length задаёт длину кода. onComplete получает строку после заполнения, что сохраняет начальные нули. Проверку кода выполняет приложение.",
    related: ["unlock-face-id"],
  },
  "star-rating": {
    behavior: "Передайте onChange для сохранения выбранной оценки. Значение обработчика — номер выбранной звезды.",
  },
  "tag-input": {
    behavior: "initial задаёт начальный набор тегов. onChange получает полный обновлённый массив после редактирования.",
  },
  "password-strength": {
    behavior: "onChange получает введённый пароль. Индикатор показывает локальную оценку сложности. Правила регистрации применяйте при отправке формы.",
  },
  "checkbox-list": {
    behavior: "items содержит подписи вариантов. onChange сообщает весь список выбранных значений.",
    related: ["task-list"],
  },
  "jelly-slider": {
    behavior: "label задаёт доступное имя. onChange получает числовое значение при перемещении бегунка.",
    related: ["wave-slider", "detent-dial"],
  },
  "detent-dial": {
    behavior: "Диск выбирает значение от 0 до 10. Используйте onChange для преобразования позиции в единицы приложения.",
    related: ["jelly-slider", "wave-slider"],
  },
  "exposure-slider": {
    behavior: "Передайте собственную фотографию в image. onChange сообщает поправку экспозиции от −2 до +2.",
  },
  "wheel-picker": {
    behavior: "Передайте варианты в items. onChange возвращает выбранную строку, которую можно сохранить в настройках.",
  },
  "scrubber": {
    behavior: "frames задаёт максимальную позицию. onChange получает целое число от 0 до frames включительно.",
  },
  "signature-pad": {
    behavior: "onSave получает PNG в виде data URL. Его можно скачать или преобразовать в файл для загрузки.",
    related: ["file-drop"],
  },
  "parallax-ticket": {
    behavior: "Передайте название, дату для показа и URL изображения обложки. Компонент отвечает за наклон билета при движении указателя.",
  },
  "glass-lens": {
    behavior: "Укажите URL изображения в image. Линза использует то же изображение, а label подписывает управление.",
  },
  "pull-refresh": {
    behavior: "Верните Promise из onRefresh и обновите данные приложения внутри обработчика. Отклонение переводит управление в состояние ошибки.",
  },
  "expand-card": {
    behavior: "Для одной карточки передайте title, body и cover. Для нескольких используйте items с содержимым каждой карточки.",
  },
  "fan-cards": {
    behavior: "cards содержит подписи карточек в порядке показа. Раскрытием веера управляет сам компонент.",
  },
  "profile-card": {
    behavior: "Передайте имя и роль. onMessage получает имя для открытия диалога, а onFollow — новое состояние подписки.",
  },
  "boarding-pass": {
    behavior: "Передайте готовые для показа обозначения аэропортов, рейса, места и выхода. boarding содержит отображаемое время посадки.",
  },
  "notification-stack": {
    behavior: "Для уведомлений с данными передайте notifications со стабильными id. onDismiss получает заголовок закрытого уведомления.",
  },
  "page-flip": {
    behavior: "Передайте текст страниц в pages в порядке чтения. Навигация и текущая позиция остаются внутри компонента.",
  },
  "stack-panel": {
    behavior: "Для плоского меню передайте items и renderPanel. Для вложенных переходов задайте карту pages и начальный ключ root.",
  },
  "weight-wave": {
    behavior: "text задаёт строку для анимации букв. Стили контейнера можно изменить через className.",
  },
  "goo-morph": {
    behavior: "words задаёт последовательность слов для перехода по нажатию. Пустой массив скрывает управление.",
    related: ["rolling-text", "dynamic-text"],
  },
  "scramble-text": {
    behavior: "Передайте в text итоговую строку, которую показывает эффект расшифровки.",
  },
  "read-along": {
    behavior: "Передайте текст целиком. interval задаёт задержку между словами в миллисекундах, минимум 120.",
  },
  "roll-links": {
    behavior: "href задаёт реальный адрес перехода, а label используется для обеих визуальных версий подписи.",
  },
  "marker-text": {
    behavior: "Передайте выделяемую фразу в text. Компонент сам переключает её выделение.",
  },
  "dynamic-text": {
    behavior: "prefix остаётся постоянным. words задаёт варианты второй части надписи, которые сменяются при нажатии.",
    related: ["rolling-text", "goo-morph"],
  },
  "typewriter": {
    behavior: "text задаёт строку, а interval — темп печати в миллисекундах.",
  },
  "music-toggle": {
    behavior: "onChange получает логический флаг. Подключите включение или паузу аудио в этом обработчике.",
  },
  "prompt-box": {
    behavior: "Передайте подсказки в suggestions, а отправку запроса ассистенту подключите через onSend. Верните Promise запроса для отображения состояния отправки.",
    related: ["chat-composer"],
  },
  "streaming-reply": {
    behavior: "text содержит ответ для постепенного показа. Получение ответа от модели выполняется в приложении.",
  },
  "ghost-suggestion": {
    behavior: "Передайте словарь автодополнения в options. onChange сообщает текст поля при вводе или принятии подсказки.",
  },
  "goo-thinking": {
    behavior: "label задаёт подпись ожидания, reply — текст демонстрируемого ответа. Для ответа из приложения обновите этот проп.",
  },
  "siri-orb": {
    behavior: "Именованный экспорт — AssistantOrb. Для внешнего управления передайте state, нормализованную амплитуду звука в amplitude и showControls={false}.",
    related: ["voice-input"],
  },
  "agent-steps": {
    behavior: "steps задаёт порядок этапов. Подпишитесь на onStep, чтобы синхронизировать продвижение с другой частью экрана.",
    related: ["step-progress"],
  },
  "tool-approval": {
    behavior: "Передайте описание действия и ресурса. onDecision сообщает выбор пользователя. Выполнение операции и проверка полномочий остаются в приложении.",
  },
  "thinking-text": {
    behavior: "Передайте статус в label и показывайте компонент, пока операция выполняется.",
  },
  "task-list": {
    behavior: "tasks задаёт названия задач. onChange передаёт полный массив названий завершённых задач.",
    related: ["checkbox-list"],
  },
  "voice-input": {
    behavior: "Запись запрашивает разрешение на микрофон. После остановки onRecord получает Blob с фактическим MIME-типом записи для сохранения или отправки.",
    related: ["siri-orb"],
  },
  "hold-to-publish": {
    behavior: "duration задаёт длительность удержания в миллисекундах. Подключите публикацию к onPublish, который вызывается по завершении удержания.",
    related: ["hold-button", "slide-to-confirm"],
  },
  "swipe-tabs": {
    behavior: "У каждого элемента есть стабильный id, title и content. Используйте defaultValue для начальной вкладки или value и onChange для управления извне.",
    related: ["tab-pill", "segmented-control"],
  },
  "lesson-outline": {
    behavior: "Укажите currentId и список уроков с id. onResume получает идентификатор урока для открытия в приложении.",
  },
  "code-exercise": {
    behavior: "Для сохранения черновика используйте отдельный draftKey на урок. Собственный onExecute получает исходник, тесты, AbortSignal и onRunning. Верните по одному результату boolean на тест в исходном порядке.",
    related: ["run-console", "test-results", "ask-tutor"],
  },
  "run-console": {
    behavior: "Для внешнего исполнителя передайте state с phase, output и duration в миллисекундах. Подключите остановку через onStop и переход к ошибке через onErrorLocation.",
    related: ["code-exercise", "test-results", "ask-tutor"],
  },
  "test-results": {
    behavior: "Каждая запись results содержит input, expected и actual. onAsk получает выбранный тест и кнопку, к которой можно вернуть фокус.",
    related: ["code-exercise", "run-console", "ask-tutor"],
  },
  "ask-tutor": {
    behavior: "onAsk получает вопрос и оставшиеся источники из context. Верните Promise с текстом и необязательной цитатой. Без обработчика отображается демонстрационный ответ.",
    related: ["code-exercise", "run-console", "test-results", "lesson-citation"],
  },
  "lesson-citation": {
    behavior: "Передайте название, позицию источника, цитату и ссылку. Используйте onReturn для возврата к нужному месту в приложении.",
    related: ["ask-tutor"],
  },
  "predict-output": {
    behavior: "answer должен совпадать с одной из строк options. onAnswer получает выбранный ответ, explanation объясняет результат.",
  },
  "execution-trace": {
    behavior: "code содержит строки программы. В каждом шаге line нумеруется с единицы, а variables задаёт значения для этого шага.",
  },
  "hint-ladder": {
    behavior: "Передайте подсказки от общей к конкретной. onReveal получает индекс только что открытой подсказки, начиная с нуля.",
  },
  "channel-list": {
    behavior: "Укажите стабильный id для каждого канала. Передайте value и обновляйте его через onSelect, чтобы связать навигацию с отображаемой перепиской.",
    related: ["course-messenger"],
  },
  "message-reactions": {
    example: `"use client";

import { useState } from "react";
import { MessageReactions, toggleReaction } from "@/components/ui/message-reactions";

export default function Reactions() {
  const [reactions, setReactions] = useState([
    { emoji: "👏", label: "Bravo", count: 2, mine: false },
  ]);

  return (
    <MessageReactions
      reactions={reactions}
      onToggle={emoji => setReactions(current => toggleReaction(current, emoji))}
    />
  );
}`,
    behavior: "При переданном reactions список управляется приложением. onToggle получает emoji, а экспорт toggleReaction вычисляет новый массив для обновления состояния.",
    related: ["chat-post"],
  },
  "issue-board": {
    behavior: "Передайте defaultIssues для локальной доски. Для синхронизации с таблицей передайте обеим один массив issues и один onIssuesChange. У каждой задачи должен быть стабильный id.",
    related: ["issue-table", "cycle-planner"],
  },
  "issue-table": {
    behavior: "При внешнем управлении onIssuesChange получает обновления как полный массив TrackerIssue. Передайте обновлённые issues таблице и связанным представлениям.",
    related: ["issue-board", "cycle-planner"],
  },
  "cycle-planner": {
    behavior: "cycleId связывает задачи с циклом, а capacity задаёт ёмкость в баллах. Передайте общие issues и onIssuesChange для синхронизации с доской.",
    related: ["issue-table", "issue-board"],
  },
};

export function guideFor(slug: Entry["slug"]) {
  return guides[slug];
}

export function usageExample(entry: Pick<Entry, "slug" | "symbol"> & { usage: string }) {
  const guide = guideFor(entry.slug);
  if (guide.example) return guide.example;
  const interactive = entry.usage.includes("=>") || /\bon[A-Z]\w*=/.test(entry.usage);
  return (interactive ? '"use client";\n\n' : "") +
    `import { ${entry.symbol} } from "@/components/ui/${entry.slug}";\n\nexport default function Example() {\n  return ${entry.usage};\n}`;
}
