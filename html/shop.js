// Shop system for Double-Edge
// Weapons will be added later

export class Shop {
  constructor(player) {
    this.player = player;
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
  buy(index) {
    const item = this.items[index];
    if (!item) return false;
    if (this.player.hearts >= item.cost) {
      this.player.hearts -= item.cost;
      // Weapon assignment will be handled when weapons are defined
      return true;
    }
    return false;
  }
}

export function renderShop(shop, container) {
  container.innerHTML = '<h2>Shop</h2>';
  shop.items.forEach((item, i) => {
    container.innerHTML += `<div style='margin:8px 0;${shop.selectedIndex===i?"background:#222;color:#fff;":""}'>`
      + `<b>${item.name}</b> - Cost: <span style='color:#f00'>${item.cost} hearts</span><br>`
      + `<span style='font-size:12px;'>${item.description}</span>`
      + `</div>`;
  });
  container.innerHTML += `<button id='buy-btn'>Buy Selected</button>`;
}
