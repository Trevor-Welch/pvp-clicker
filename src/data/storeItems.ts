// src/data/storeItems.ts
import type { StoreItemData } from '../types/game';

export const STORE_ITEMS: StoreItemData[] = [
  // Passive items
  {
    id: 'extra_mouse',
    name: 'Extra Mouse',
    description: 'Adds +1 passive income per second',
    cost: 20,
    type: 'passive',
    passiveIncomeBonus: 1,
    targetType: 'self',
    icon: '🖱️'
  },
  
  // Active items
  {
    id: 'adrenaline',
    name: 'Adrenaline Shot',
    description: '10x click power for 30 seconds',
    cost: 100,
    type: 'active',
    effect: {
      id: 'adrenaline_boost',
      type: 'click_multiplier',
      value: 10,
      name: 'Adrenaline Rush',
      description: '10x clicking power',
      duration: 30
    },
    targetType: 'self',
    icon: '💉'
  },
  {
    id: 'focus_potion',
    name: 'Focus Potion',
    description: 'Auto-click 5 times per second for 15 seconds',
    cost: 150,
    type: 'active',
    effect: {
      id: 'auto_click',
      type: 'auto_click',
      value: 5,
      name: 'Auto Clicker',
      description: 'Automatically clicks 5 times per second',
      duration: 15
    },
    targetType: 'self',
    icon: '🧪'
  },
  {
    id: 'golden_cookie',
    name: 'Golden Cookie',
    description: '5x passive income for 60 seconds',
    cost: 200,
    type: 'active',
    effect: {
      id: 'golden_boost',
      type: 'passive_multiplier',
      value: 5,
      name: 'Golden Blessing',
      description: '5x passive income generation',
      duration: 60
    },
    targetType: 'self',
    icon: '🍪'
  },
  {
    id: 'slow_curse',
    name: 'Molasses Curse',
    description: 'Halves opponent\'s click power for 20 seconds',
    cost: 250,
    type: 'active',
    effect: {
      id: 'slow_curse_debuff',
      type: 'click_multiplier',
      value: 0.5, // Half click power
      name: 'Molasses Curse',
      description: 'Click power reduced by 50%',
      duration: 20
    },
    targetType: 'opponent', // New field to indicate this targets opponent
    icon: '🍯'
  },
  {
    id: 'drain_curse',
    name: 'Passive Drain',
    description: 'Reduces opponent\'s passive income by 75% for 30 seconds',
    cost: 300,
    type: 'active',
    effect: {
      id: 'passive_drain_debuff',
      type: 'passive_multiplier',
      value: 0.25, // Only 25% passive income
      name: 'Passive Drain',
      description: 'Passive income reduced by 75%',
      duration: 30
    },
    targetType: 'opponent',
    icon: '🧛'
  },
  {
    id: 'click_block',
    name: 'Finger Freeze',
    description: 'Opponent cannot manually click for 10 seconds',
    cost: 400,
    type: 'active',
    effect: {
      id: 'click_block_debuff',
      type: 'click_multiplier',
      value: 0, // No manual clicks
      name: 'Finger Freeze',
      description: 'Manual clicking disabled',
      duration: 10
    },
    targetType: 'opponent',
    icon: '❄️'
  }
];