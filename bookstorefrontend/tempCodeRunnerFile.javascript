const bookQuotesArr = [

  {
    'Frank Zappa': 'So many books, so little time.'},
    {' Marcus Tullius Cicero': 'A room without books is like a body without a soul.'
  },
  { 'Jane Austen, Northanger Abbey': 'The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.' },
  { 'Mark Twain': 'Good friends, good books, and a sleepy conscience: this is the ideal life.' },
  { 'Neil Gaiman, Coraline': 'Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten' },
  { 'Groucho Marx, The Essential Groucho: Writings For By And About': 'Outside of a dog, a book is man\'s best friend.Inside of a dog it\'s too dark to read.' },
  { 'Haruki Murakami, Norwegian Wood': 'If you only read the books that everyone else is reading, you can only think what everyone else is thinking.' },
  { 'Jorge Luis Borges': 'I have always imagined that Paradise will be a kind of library.' },
  { 'Lemony Snicket, Horseradish: Bitter Truths You Can\'t Avoid': 'Never trust anyone who has not brought a book with them.' },
  { 'C.S. Lewis': 'You can never get a cup of tea large enough or a book long enough to suit me.' },
  { 'Oscar Wilde': 'If one cannot enjoy reading a book over and over again, there is no use in reading it at all.' },
  { 'Ernest Hemingway': 'There is no friend as loyal as a book.' }
];
let idx = 0;
const bookQuoteInterval = setInterval( () => {
  if ( idx === bookQuotesArr.length ) idx = 0;
  let key, value;
  [[key,value]] = Object.entries(bookQuotesArr[idx])
  idx++;
  console.log(`${value}-- ${key}`)
  return (
    `${value}-- ${key}`
  );
}, 3000 );

bookQuoteInterval