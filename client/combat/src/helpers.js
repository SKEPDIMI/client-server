import _ from 'underscore';

var helpers = {}

helpers.generateScreensFromPlayer = (player) => {
  if (player._loading) return null

  let parsedAttacks = [];

  _.pairs(player.attacks).forEach(pair => {
    let title = pair[0];
    let attackInfo = pair[1];

    parsedAttacks.push({
      title,
      attackInfo,
      type: 'attack',
    });
  });

  let SCREENS = {
    root: {
      options: [
          { title: 'Attacks', to: 'attacks' },
          { title: 'Potions', to: 'potions' },
          { title: 'Actions', to: 'actions' }
        ]
    },
    potions: {
      options: [
        { title: 'Back', to: 'root' },
        { title: 'Heal'},
        { title: 'Thorns'},
        { title: 'Poison'},
        { title: 'Mana'}
      ]
    },
    attacks: {
      options: [
        { title: 'Back', to: 'root'},
        ...parsedAttacks
      ]
    },
    actions: {
      options: [
        { title: 'Back', to: 'root'},
        { title: 'Run away'},
      ]
    }
  }

  return SCREENS
}

export default helpers
