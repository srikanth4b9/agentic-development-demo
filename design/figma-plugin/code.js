// Support Desk DS Builder — Figma plugin (development plugin, run locally).
// Creates in the current Figma file:
//   • Variable collection "Support Desk DS" (colors, spacing, radius) with WEB code syntax = CSS vars
//   • Text styles (Display, Heading, Title, Body, Label, Caption)
//   • Pages: Foundations, Components, Screens
//   • Components: Button, Badge, Text Field, Select, Stat Card, Request Card, Empty State,
//     Error State, Dialog / New Request
//   • Screens: Support Requests Dashboard, New Request Dialog, Dashboard — Empty, Dashboard — Error
// Re-running replaces the three pages and the variable collection (other pages are untouched).
// Keep TOKENS in sync with design/tokens.json and src/styles/tokens.css.

const TOKENS = {
  color: {
    'color/bg': '#f4f6fb',
    'color/surface': '#ffffff',
    'color/surface-muted': '#eef1f6',
    'color/border': '#dbe2ee',
    'color/border-strong': '#b8c3d6',
    'color/text': '#1b2540',
    'color/text-muted': '#5b6785',
    'color/primary': '#3355d6',
    'color/primary-hover': '#2744b8',
    'color/primary-contrast': '#ffffff',
    'color/focus-ring': '#6b8cff',
    'tone/neutral-bg': '#eef1f6',
    'tone/neutral-fg': '#3a4560',
    'tone/info-bg': '#e0ebff',
    'tone/info-fg': '#1f4fb3',
    'tone/warning-bg': '#fdf0c8',
    'tone/warning-fg': '#7a5200',
    'tone/accent-bg': '#e7e3fb',
    'tone/accent-fg': '#4b3aa8',
    'tone/success-bg': '#d9f3e6',
    'tone/success-fg': '#146c43',
    'tone/danger-bg': '#fde2e2',
    'tone/danger-fg': '#a3242a',
  },
  space: {
    'space/1': 4,
    'space/2': 8,
    'space/3': 12,
    'space/4': 16,
    'space/5': 24,
    'space/6': 32,
    'space/7': 48,
  },
  radius: { 'radius/sm': 6, 'radius/md': 10, 'radius/lg': 16, 'radius/pill': 999 },
};

const TEXT_STYLES = [
  ['Display/28 Bold', 28, 'Bold', 36],
  ['Heading/20 Bold', 20, 'Bold', 28],
  ['Title/16 Semibold', 16, 'Semi Bold', 24],
  ['Body/14 Regular', 14, 'Regular', 20],
  ['Label/14 Medium', 14, 'Medium', 20],
  ['Label/14 Semibold', 14, 'Semi Bold', 20],
  ['Caption/12 Semibold', 12, 'Semi Bold', 16],
  ['Caption/12 Regular', 12, 'Regular', 16],
];

const TONES = ['Neutral', 'Info', 'Warning', 'Accent', 'Success', 'Danger'];
const PAGE_NAMES = ['Foundations', 'Components', 'Screens'];
const COLLECTION = 'Support Desk DS';

/** @type {Record<string, Variable>} */ const V = {};
/** @type {Record<string, TextStyle>} */ const S = {};

// ---------------------------------------------------------------- helpers
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function paint(varName) {
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    V[varName],
  );
}

function bindPadding(node, x, y) {
  if (x !== undefined) {
    if (typeof x === 'number') {
      node.paddingLeft = x;
      node.paddingRight = x;
    } else {
      node.setBoundVariable('paddingLeft', V[x]);
      node.setBoundVariable('paddingRight', V[x]);
    }
  }
  if (y !== undefined) {
    if (typeof y === 'number') {
      node.paddingTop = y;
      node.paddingBottom = y;
    } else {
      node.setBoundVariable('paddingTop', V[y]);
      node.setBoundVariable('paddingBottom', V[y]);
    }
  }
}

function bindRadius(node, r) {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) {
    node.setBoundVariable(k, V[r]);
  }
}

/** Configure an auto-layout frame or component. */
function layout(node, o = {}) {
  node.layoutMode = o.dir || 'VERTICAL';
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
  node.fills = o.fill ? [paint(o.fill)] : [];
  if (o.stroke) {
    node.strokes = [paint(o.stroke)];
    node.strokeWeight = 1;
  }
  if (o.dashed) node.dashPattern = [6, 4];
  if (o.gap) node.setBoundVariable('itemSpacing', V[o.gap]);
  bindPadding(node, o.padX !== undefined ? o.padX : o.pad, o.padY !== undefined ? o.padY : o.pad);
  if (o.radius) bindRadius(node, o.radius);
  if (o.align) node.counterAxisAlignItems = o.align;
  if (o.justify) node.primaryAxisAlignItems = o.justify;
  if (o.name) node.name = o.name;
  return node;
}

function frame(name, o = {}) {
  return layout(figma.createFrame(), Object.assign({ name }, o));
}

function fixedWidth(node, width) {
  if (node.layoutMode === 'HORIZONTAL') node.primaryAxisSizingMode = 'FIXED';
  else node.counterAxisSizingMode = 'FIXED';
  node.resize(width, Math.max(node.height, 1));
}

async function text(chars, style, color = 'color/text') {
  const t = figma.createText();
  await t.setTextStyleIdAsync(S[style].id);
  t.characters = chars;
  t.fills = [paint(color)];
  return t;
}

function add(parent, ...children) {
  for (const c of children) parent.appendChild(c);
  return parent;
}

function fill(node) {
  node.layoutSizingHorizontal = 'FILL';
  return node;
}

function variants(components, page, name, x, y) {
  for (const c of components) page.appendChild(c);
  const set = figma.combineAsVariants(components, page);
  set.name = name;
  layout(set, {
    dir: 'HORIZONTAL',
    gap: 'space/4',
    pad: 'space/4',
    stroke: 'color/border',
    radius: 'radius/md',
  });
  set.dashPattern = [4, 4];
  set.x = x;
  set.y = y;
  return set;
}

function setText(instance, index, chars) {
  const texts = instance.findAll((n) => n.type === 'TEXT');
  if (texts[index]) texts[index].characters = chars;
}

// ---------------------------------------------------------------- foundations
async function createVariables() {
  const existing = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (c) => c.name === COLLECTION,
  );
  if (existing) existing.remove();
  const col = figma.variables.createVariableCollection(COLLECTION);
  const modeId = col.modes[0].modeId;
  col.renameMode(modeId, 'Light');

  const make = (name, type, value, scopes) => {
    const v = figma.variables.createVariable(name, col, type);
    v.setValueForMode(modeId, value);
    v.scopes = scopes;
    v.setVariableCodeSyntax('WEB', `var(--${name.replace('/', '-')})`);
    V[name] = v;
  };
  for (const [n, hex] of Object.entries(TOKENS.color))
    make(n, 'COLOR', hexToRgb(hex), ['ALL_FILLS', 'STROKE_COLOR']);
  for (const [n, px] of Object.entries(TOKENS.space)) make(n, 'FLOAT', px, ['GAP', 'WIDTH_HEIGHT']);
  for (const [n, px] of Object.entries(TOKENS.radius)) make(n, 'FLOAT', px, ['CORNER_RADIUS']);
}

async function createTextStyles() {
  const existing = await figma.getLocalTextStylesAsync();
  for (const [name, size, style, lineHeight] of TEXT_STYLES) {
    const s = existing.find((x) => x.name === name) || figma.createTextStyle();
    s.name = name;
    s.fontName = { family: 'Inter', style };
    s.fontSize = size;
    s.lineHeight = { unit: 'PIXELS', value: lineHeight };
    S[name] = s;
  }
}

async function resetPages() {
  const old = figma.root.children.filter((p) => PAGE_NAMES.includes(p.name));
  const pages = {};
  for (const n of PAGE_NAMES) {
    const p = figma.createPage();
    p.name = n;
    pages[n] = p;
  }
  await figma.setCurrentPageAsync(pages.Foundations);
  for (const p of old) p.remove();
  return pages;
}

async function buildFoundations(page) {
  const root = frame('Foundations', { gap: 'space/6', pad: 'space/6', fill: 'color/bg' });
  fixedWidth(root, 1280);
  page.appendChild(root);
  add(root, await text('Support Desk DS — Foundations', 'Display/28 Bold'));

  // Colors
  add(root, await text('Color', 'Heading/20 Bold'));
  const swatches = frame('Colors', { dir: 'HORIZONTAL', gap: 'space/4' });
  root.appendChild(swatches);
  fill(swatches);
  swatches.layoutWrap = 'WRAP';
  swatches.counterAxisSpacing = 16;
  for (const [name, hex] of Object.entries(TOKENS.color)) {
    const card = frame(name, {
      gap: 'space/2',
      pad: 'space/3',
      fill: 'color/surface',
      stroke: 'color/border',
      radius: 'radius/md',
    });
    fixedWidth(card, 180);
    const chip = figma.createRectangle();
    chip.resize(156, 48);
    chip.fills = [paint(name)];
    chip.strokes = [paint('color/border')];
    bindRadius(chip, 'radius/sm');
    add(
      card,
      chip,
      await text(name, 'Caption/12 Semibold'),
      await text(
        `${hex}  ·  var(--${name.replace('/', '-')})`,
        'Caption/12 Regular',
        'color/text-muted',
      ),
    );
    swatches.appendChild(card);
  }

  // Spacing & radius
  add(root, await text('Spacing (4px scale)', 'Heading/20 Bold'));
  const spacing = frame('Spacing', { gap: 'space/2' });
  root.appendChild(spacing);
  for (const [name, px] of Object.entries(TOKENS.space)) {
    const row = frame(name, { dir: 'HORIZONTAL', gap: 'space/3', align: 'CENTER' });
    const bar = figma.createRectangle();
    bar.resize(px, 16);
    bar.fills = [paint('color/primary')];
    bar.setBoundVariable('width', V[name]);
    add(row, bar, await text(`${name} — ${px}px`, 'Body/14 Regular'));
    spacing.appendChild(row);
  }

  add(root, await text('Radius', 'Heading/20 Bold'));
  const radii = frame('Radius', { dir: 'HORIZONTAL', gap: 'space/4' });
  root.appendChild(radii);
  for (const [name, px] of Object.entries(TOKENS.radius)) {
    const box = frame(name, {
      pad: 'space/4',
      fill: 'color/surface',
      stroke: 'color/border-strong',
      radius: name,
      align: 'CENTER',
    });
    add(box, await text(`${name} (${px})`, 'Caption/12 Semibold'));
    radii.appendChild(box);
  }

  // Type
  add(root, await text('Typography — Inter', 'Heading/20 Bold'));
  const type = frame('Type', { gap: 'space/3' });
  root.appendChild(type);
  for (const [name] of TEXT_STYLES)
    type.appendChild(await text(`${name} — Support requests`, name));
}

// ---------------------------------------------------------------- components
async function buildComponents(page) {
  const C = {};
  let y = 0;
  const title = await text('Support Desk DS — Components', 'Display/28 Bold');
  page.appendChild(title);
  y += 80;

  // Button
  const buttons = [];
  for (const [name, bg, fg, stroke] of [
    ['Primary', 'color/primary', 'color/primary-contrast', null],
    ['Secondary', 'color/surface', 'color/text', 'color/border-strong'],
    ['Ghost', null, 'color/primary', null],
  ]) {
    const c = layout(figma.createComponent(), {
      name: `Variant=${name}`,
      dir: 'HORIZONTAL',
      gap: 'space/2',
      padX: 'space/4',
      padY: 'space/2',
      radius: 'radius/md',
      fill: bg,
      stroke,
      align: 'CENTER',
    });
    c.appendChild(await text('Button', 'Label/14 Semibold', fg));
    c.description = 'src/components/ui/Button.tsx — <Button variant>';
    buttons.push(c);
  }
  C.button = variants(buttons, page, 'Button', 0, y);
  C.button.description =
    'Maps to <Button variant="primary|secondary|ghost"> in src/components/ui/Button.tsx';
  y += C.button.height + 48;

  // Badge
  const badges = [];
  for (const tone of TONES) {
    const t = tone.toLowerCase();
    const c = layout(figma.createComponent(), {
      name: `Tone=${tone}`,
      dir: 'HORIZONTAL',
      padX: 'space/3',
      padY: 2,
      radius: 'radius/pill',
      fill: `tone/${t}-bg`,
      align: 'CENTER',
    });
    c.appendChild(await text(tone, 'Caption/12 Semibold', `tone/${t}-fg`));
    badges.push(c);
  }
  C.badge = variants(badges, page, 'Badge', 0, y);
  C.badge.description =
    'Maps to <Badge tone> in src/components/ui/Badge.tsx. Status: Open=Warning, In progress=Accent, Resolved=Success. Priority: Low=Neutral, Medium=Info, High=Warning, Urgent=Danger.';
  y += C.badge.height + 48;

  // Text Field
  const fields = [];
  for (const state of ['Default', 'Error']) {
    const c = layout(figma.createComponent(), { name: `State=${state}`, gap: 'space/1' });
    const box = frame('Input', {
      dir: 'HORIZONTAL',
      padX: 'space/3',
      padY: 'space/2',
      radius: 'radius/md',
      fill: 'color/surface',
      stroke: state === 'Error' ? 'tone/danger-fg' : 'color/border-strong',
    });
    box.appendChild(await text('Placeholder', 'Body/14 Regular', 'color/text-muted'));
    add(c, await text('Label', 'Label/14 Medium'), box);
    fixedWidth(c, 320);
    fill(box);
    c.appendChild(
      state === 'Error'
        ? await text('Error message', 'Caption/12 Regular', 'tone/danger-fg')
        : await text('Hint text', 'Caption/12 Regular', 'color/text-muted'),
    );
    fields.push(c);
  }
  C.textField = variants(fields, page, 'Text Field', 0, y);
  C.textField.description =
    'Maps to <TextField label hint error> / <TextArea> in src/components/ui/TextField.tsx';
  y += C.textField.height + 48;

  // Select
  const sel = layout(figma.createComponent(), { name: 'Select', gap: 'space/1' });
  const selBox = frame('Control', {
    dir: 'HORIZONTAL',
    padX: 'space/3',
    padY: 'space/2',
    radius: 'radius/md',
    fill: 'color/surface',
    stroke: 'color/border-strong',
    justify: 'SPACE_BETWEEN',
  });
  add(
    selBox,
    await text('All', 'Body/14 Regular'),
    await text('▾', 'Body/14 Regular', 'color/text-muted'),
  );
  add(sel, await text('Status', 'Label/14 Medium'), selBox);
  fixedWidth(sel, 240);
  fill(selBox);
  sel.description =
    'Maps to <Select label options value onChange> in src/components/ui/Select.tsx (native <select>)';
  page.appendChild(sel);
  sel.x = 0;
  sel.y = y;
  C.select = sel;
  y += sel.height + 48;

  // Stat Card
  const stat = layout(figma.createComponent(), {
    name: 'Stat Card',
    gap: 'space/1',
    padX: 'space/4',
    padY: 'space/3',
    radius: 'radius/lg',
    fill: 'color/surface',
    stroke: 'color/border',
  });
  add(
    stat,
    await text('24', 'Display/28 Bold'),
    await text('TOTAL', 'Caption/12 Semibold', 'color/text-muted'),
  );
  fixedWidth(stat, 320);
  stat.description =
    'Card (src/components/ui/Card.tsx) with a large value and an uppercase label. Value is zero-padded (08).';
  page.appendChild(stat);
  stat.y = y;
  C.stat = stat;
  y += stat.height + 48;

  // Request Card
  const card = layout(figma.createComponent(), {
    name: 'Request Card',
    dir: 'HORIZONTAL',
    padX: 'space/4',
    padY: 'space/3',
    radius: 'radius/lg',
    fill: 'color/surface',
    stroke: 'color/border',
    justify: 'SPACE_BETWEEN',
    align: 'CENTER',
  });
  const left = frame('Content', { gap: 'space/1' });
  add(
    left,
    await text('Unable to export report', 'Title/16 Semibold'),
    await text('REQ-1001 · Priya N. · 1 Nov 2026', 'Body/14 Regular', 'color/text-muted'),
  );
  const right = frame('Badges', { dir: 'HORIZONTAL', gap: 'space/2' });
  const pBadge = C.badge.children.find((c) => c.name === 'Tone=Warning').createInstance();
  pBadge.name = 'Priority';
  setText(pBadge, 0, 'High');
  const sBadge = C.badge.children.find((c) => c.name === 'Tone=Warning').createInstance();
  sBadge.name = 'Status';
  setText(sBadge, 0, 'Open');
  add(right, pBadge, sBadge);
  add(card, left, right);
  fixedWidth(card, 1008);
  card.description =
    'SupportRequestCard: <Card as="article"> with title (h3), meta line, Priority + Status <Badge>s.';
  page.appendChild(card);
  card.y = y;
  C.card = card;
  y += card.height + 48;

  // Empty / Error state
  const empty = layout(figma.createComponent(), {
    name: 'Empty State',
    gap: 'space/2',
    padX: 'space/4',
    padY: 'space/7',
    radius: 'radius/lg',
    fill: 'color/surface',
    stroke: 'color/border-strong',
    dashed: true,
    align: 'CENTER',
  });
  add(
    empty,
    await text('No requests match your filters', 'Title/16 Semibold'),
    await text('Try a different search term or status.', 'Body/14 Regular', 'color/text-muted'),
  );
  const emptyBtn = C.button.children.find((c) => c.name === 'Variant=Secondary').createInstance();
  setText(emptyBtn, 0, 'Clear filters');
  empty.appendChild(emptyBtn);
  fixedWidth(empty, 1008);
  empty.description = 'EmptyState in src/components/ui/StatePanels.tsx';
  page.appendChild(empty);
  empty.y = y;
  C.empty = empty;
  y += empty.height + 48;

  const error = layout(figma.createComponent(), {
    name: 'Error State',
    gap: 'space/2',
    padX: 'space/4',
    padY: 'space/7',
    radius: 'radius/lg',
    fill: 'tone/danger-bg',
    stroke: 'tone/danger-fg',
    dashed: true,
    align: 'CENTER',
  });
  add(
    error,
    await text('Could not load support requests', 'Title/16 Semibold'),
    await text('The support service is unavailable.', 'Body/14 Regular'),
  );
  const retry = C.button.children.find((c) => c.name === 'Variant=Secondary').createInstance();
  setText(retry, 0, 'Try again');
  error.appendChild(retry);
  fixedWidth(error, 1008);
  error.description = 'ErrorState in src/components/ui/StatePanels.tsx (role="alert")';
  page.appendChild(error);
  error.y = y;
  C.error = error;
  y += error.height + 48;

  // Dialog / New Request
  const dialog = layout(figma.createComponent(), {
    name: 'Dialog / New Request',
    gap: 'space/4',
    pad: 'space/5',
    radius: 'radius/lg',
    fill: 'color/surface',
  });
  dialog.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.06, g: 0.09, b: 0.16, a: 0.12 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];
  const titleField = C.textField.children.find((c) => c.name === 'State=Default').createInstance();
  setText(titleField, 0, 'Title');
  setText(titleField, 1, 'e.g. Export fails on Safari');
  setText(titleField, 2, '5–120 characters');
  const descField = C.textField.children.find((c) => c.name === 'State=Default').createInstance();
  setText(descField, 0, 'Description');
  setText(descField, 1, 'What happened, and what did you expect?');
  setText(descField, 2, '10–2000 characters');
  const prio = C.select.createInstance();
  setText(prio, 0, 'Priority');
  setText(prio, 1, 'Medium');
  const actions = frame('Actions', { dir: 'HORIZONTAL', gap: 'space/3', justify: 'MAX' });
  const cancel = C.button.children.find((c) => c.name === 'Variant=Secondary').createInstance();
  setText(cancel, 0, 'Cancel');
  const submit = C.button.children.find((c) => c.name === 'Variant=Primary').createInstance();
  setText(submit, 0, 'Submit Request');
  add(actions, cancel, submit);
  add(
    dialog,
    await text('New support request', 'Heading/20 Bold'),
    titleField,
    descField,
    prio,
    actions,
  );
  fixedWidth(dialog, 520);
  for (const n of [titleField, descField, prio, actions]) fill(n);
  dialog.description =
    'Dialog (src/components/ui/Dialog.tsx) containing TextField, TextArea, Select, Buttons. Must be modal, close on Escape, return focus.';
  page.appendChild(dialog);
  dialog.y = y;
  C.dialog = dialog;

  return C;
}

// ---------------------------------------------------------------- screens
const SAMPLE = [
  [
    'Unable to export report',
    'REQ-1001 · Priya N. · 1 Nov 2026',
    ['Warning', 'High'],
    ['Warning', 'Open'],
  ],
  [
    'Add dark mode support',
    'REQ-1002 · Marco T. · 1 Nov 2026',
    ['Neutral', 'Low'],
    ['Accent', 'In progress'],
  ],
  [
    'Improve search filters',
    'REQ-1003 · Aisha K. · 1 Nov 2026',
    ['Info', 'Medium'],
    ['Success', 'Resolved'],
  ],
  [
    'Login loop on Safari 17',
    'REQ-1004 · Dev R. · 1 Nov 2026',
    ['Danger', 'Urgent'],
    ['Warning', 'Open'],
  ],
];

async function dashboardShell(C, name) {
  const screen = frame(name, { gap: 'space/4', padX: 96, padY: 'space/6', fill: 'color/bg' });
  fixedWidth(screen, 1200);

  const header = frame('Header', { dir: 'HORIZONTAL', justify: 'SPACE_BETWEEN', align: 'CENTER' });
  const newBtn = C.button.children.find((c) => c.name === 'Variant=Primary').createInstance();
  setText(newBtn, 0, '+ New Request');
  add(header, await text('Support Requests', 'Display/28 Bold'), newBtn);

  const stats = frame('Stats', { dir: 'HORIZONTAL', gap: 'space/4' });
  for (const [v, l] of [
    ['24', 'TOTAL'],
    ['08', 'OPEN'],
    ['16', 'RESOLVED'],
  ]) {
    const s = C.stat.createInstance();
    setText(s, 0, v);
    setText(s, 1, l);
    stats.appendChild(s);
  }

  const filters = frame('Filters', { dir: 'HORIZONTAL', gap: 'space/3', align: 'MAX' });
  const search = C.textField.children.find((c) => c.name === 'State=Default').createInstance();
  setText(search, 0, 'Search requests');
  setText(search, 1, '⌕  Search by title or ID…');
  search.findAll((n) => n.type === 'TEXT')[2].visible = false;
  const status = C.select.createInstance();
  setText(status, 0, 'Status');
  add(filters, search, status);

  add(screen, header, stats, filters);
  for (const n of [header, stats, filters]) fill(n);
  for (const s of stats.children) fill(s);
  fill(search);
  return screen;
}

async function buildScreens(page, C) {
  // 1. Dashboard
  const dash = await dashboardShell(C, 'Support Requests Dashboard');
  const list = frame('Request List', { gap: 'space/3' });
  for (const [title, meta, [pTone, pLabel], [sTone, sLabel]] of SAMPLE) {
    const card = C.card.createInstance();
    setText(card, 0, title);
    setText(card, 1, meta);
    const [p, s] = card.findAll((n) => n.type === 'INSTANCE');
    p.setProperties({ Tone: pTone });
    s.setProperties({ Tone: sTone });
    setText(p, 0, pLabel);
    setText(s, 0, sLabel);
    list.appendChild(card);
  }
  dash.appendChild(list);
  fill(list);
  for (const c of list.children) fill(c);
  page.appendChild(dash);

  // 2. New Request Dialog (over the dashboard)
  const overlay = figma.createFrame();
  overlay.name = 'New Request Dialog';
  overlay.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.09, b: 0.16 }, opacity: 0.45 }];
  overlay.layoutMode = 'VERTICAL';
  overlay.primaryAxisSizingMode = 'FIXED';
  overlay.counterAxisSizingMode = 'FIXED';
  overlay.resize(1200, 900);
  overlay.primaryAxisAlignItems = 'CENTER';
  overlay.counterAxisAlignItems = 'CENTER';
  overlay.appendChild(C.dialog.createInstance());
  overlay.x = 1300;
  page.appendChild(overlay);

  // 3. Empty and 4. Error variants of the dashboard (no loading state designed — on purpose)
  const emptyScreen = await dashboardShell(C, 'Dashboard — Empty (filtered)');
  emptyScreen.appendChild(C.empty.createInstance());
  emptyScreen.x = 2600;
  page.appendChild(emptyScreen);

  const errorScreen = await dashboardShell(C, 'Dashboard — Error');
  errorScreen.appendChild(C.error.createInstance());
  errorScreen.x = 3900;
  page.appendChild(errorScreen);

  // State panels stretch to the screen width (FILL must be set after the node is appended).
  for (const s of [emptyScreen, errorScreen]) fill(s.children[s.children.length - 1]);
}

// ---------------------------------------------------------------- main
async function main() {
  await Promise.all(
    ['Regular', 'Medium', 'Semi Bold', 'Bold'].map((style) =>
      figma.loadFontAsync({ family: 'Inter', style }),
    ),
  );
  await createVariables();
  await createTextStyles();
  const pages = await resetPages();
  await buildFoundations(pages.Foundations);
  await figma.setCurrentPageAsync(pages.Components);
  const C = await buildComponents(pages.Components);
  await figma.setCurrentPageAsync(pages.Screens);
  await buildScreens(pages.Screens, C);
  figma.viewport.scrollAndZoomIntoView(pages.Screens.children);
  figma.closePlugin('✅ Support Desk DS created: variables, text styles, components and screens.');
}

main().catch((e) => {
  console.error(e);
  figma.closePlugin(`❌ Support Desk DS failed: ${e && e.message ? e.message : e}`);
});
