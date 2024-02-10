import { usePrompts } from './game_integration/actions/actionAPI.js';
const abby = {
  name: 'Abigail',
  sprite: 'Abigail_Chen.png',
  age: 32,
  career: 'Financial Analyst',
  specialty: "I'll create a spreadsheet for your given topic",
  personality:
    'Abigail is a detail-oriented and analytical thinker. She is always looking for the most efficient solution to a problem.',
  frame: 0,
  uid: '1',
  playerControlled: true,
  momentResponse: null,
  render: true,
  details: [
    'starts work at 8:00AM',
    'loves to cook',
    'loves doing research',
    'loves to dance',
  ],
};

const agentState = ['is hungry', 'is broke', 'is running late for work'];
const worldState = ['it is 7:50AM', 'a sunny day', 'it is Monday'];

const result = await usePrompts([
  {
    action: 'location',
    persona: abby,
    locations: [],
    id: 1,
    worldState,
    agentState,
  },
]);

console.log(result);
