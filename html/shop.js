// Shop system for Double-Edge
// Weapons will be added later

export class Shop {
  constructor() {
    this.items = [];
    this.selectedIndex = 0;
  }
  addItem(name, cost, description) {
    this.items.push({ name, cost, description });
  }
  setupDefaultItems() {
  this.addItem('Scythe', 1, 'More range, more damage, slower cooldown. White color.');
  this.addItem('Spellcaster', 3, 'Cast spells: Fireball (Z), Ice Ball (C), Heal (R). Magic meter: 3.');
  }
  buy(index, player) {
    const item = this.items[index];
    if (!item || !player) return false;
    if (player.hearts >= item.cost) {
      player.hearts -= item.cost;
      return true;
    }
    return false;
  }
}

export function renderShop(shop, container) {
  container.innerHTML = '<h2>Shop</h2>';
  shop.items.forEach((item, i) => {
    const selected = shop.selectedIndex === i;
    container.innerHTML += `<div class='shop-item' style='margin:8px 0;padding:8px;border-radius:6px;${selected?"background:#222;color:#fff;border:2px solid #f0f;box-shadow:0 0 8px #f0f;":"border:2px solid #444;"}'>`
      + `<b>${item.name}</b> - Cost: <span style='color:#f00'>${item.cost} hearts</span><br>`
      + `<span style='font-size:12px;'>${item.description}</span>`
      + `${selected?"<span style='float:right;color:#f0f;font-weight:bold;'>SELECTED</span>":""}`
      + `</div>`;
  });
  container.innerHTML += `<button id='buy-btn'>Buy Selected</button>`;
}
