// All teaching text. Quotes are verbatim from the sources named.
// "via" = the place this demo took the wording from.
export const SOURCES = {
  bowen: { t: 'José Antonio Bowen, "Liszt the Teacher," Journal of the American Liszt Society 52/53 (Fall 2002/Spring 2003), 1-63', u: 'https://weteachwithai.com/wp-content/uploads/2026/11/Bowen-Liszt-the-Teacher-Journal-of-the-American-Liszt-Society.pdf' },
  bib: { t: 'José Antonio Bowen and E. Douglas Bomberger, "An Annotated Bibliography of Students and Observers of Liszt\'s Teaching," JALS 52/53, 44-63', u: 'https://weteachwithai.com/wp-content/uploads/2026/11/BowenBomberger-Liszt-Teaching-Sources-Biblio-FINAL.pdf' },
  fay: { t: 'Amy Fay, Music-Study in Germany (Chicago, 1880; 1883 printing)', u: 'https://www.gutenberg.org/ebooks/37322' },
  siloti: { t: 'Alexander Siloti, "Meine Erinnerungen an Franz Liszt," Zeitschrift der Internationalen Musikgesellschaft 14 (1913); English as My Memories of Liszt', u: 'https://www.siloti.org/memories-liszt.html' },
  lamond: { t: 'Frederic Lamond, The Memoirs of Frederic Lamond (Glasgow: William MacLellan, 1949)' },
  lachmund: { t: 'Carl Lachmund, Living with Liszt, ed. Alan Walker (Stuyvesant, NY: Pendragon, 1995)' },
  friedheim: { t: 'Arthur Friedheim, Life and Liszt, ed. Theodore Bullock (New York: Taplinger, 1961)' },
  riesberg: { t: 'F. W. Riesberg, "Gala Days with Liszt at Weimar," The Etude 54/11 (November 1936)' },
  bagby: { t: 'Albert Morris Bagby, "A Summer with Liszt in Weimar," The Century Magazine (September 1886)' },
  mason: { t: 'William Mason, Memories of a Musical Life (New York: Century, 1901)', u: 'https://www.gutenberg.org/ebooks/35520' },
  iaLamond: { t: 'Internet Archive: Frederic Lamond, Beethoven "Moonlight" Sonata, HMV D 718-719 (1922), Public Domain Mark', u: 'https://archive.org/details/1922-moonlight-sonata-c-sharp-minor-beethoven-frederic-lamond-hmv-d-718-3-sides' },
  iaAlbert: { t: 'Internet Archive: Eugen d\'Albert, Odeon XX 76933, 76937, 76940 (recorded 1 July 1912)', u: 'https://archive.org/details/1-eugen-d-albert-odeon-xx-76933-weber-1912' },
};

// kind: 'piece' = said about this piece, 'witness' = someone describing Liszt playing it,
// 'composer' = about another piece by this composer, 'general' = general teaching.
export const KIND = {
  piece: 'About this piece',
  witness: 'A witness on Liszt playing this piece',
  composer: 'About this composer, not this piece',
  general: 'General advice, not about this piece',
};

export const PEOPLE = {
  liszt: { name: 'Franz Liszt', dates: '1811-1886', role: 'Teacher. He took no fee for lessons in Weimar.', recorded: false },
  lamond: { name: 'Frederic Lamond', dates: '1868-1948', role: 'Pupil in Weimar, 1885-86. Recorded for HMV from 1919.', recorded: true },
  dalbert: { name: 'Eugen d\'Albert', dates: '1864-1932', role: 'Pupil in Weimar from 1882. Recorded for Odeon in 1912.', recorded: true },
  fay: { name: 'Amy Fay', dates: '1844-1928', role: 'American pupil in Weimar, 1873. Her letters home were published in 1880. She made no recordings.', recorded: false },
  siloti: { name: 'Alexander Siloti', dates: '1863-1945', role: 'Pupil in Weimar, 1883-86. He left a memoir and no commercial recordings.', recorded: false },
};

export const PIECES = [
  {
    id: 'moon1', composer: 'Beethoven', title: 'Sonata in C sharp minor, Op. 27 No. 2, "Moonlight"', part: 'First movement, opening',
    player: 'lamond', year: 1922, age: 54, gap: 36, label: 'HMV D 718', src: 'iaLamond', clip: 'clips/lamond-moonlight-1.mp3',
    said: [
      { kind: 'piece', who: 'siloti', text: 'Dear child, this piece may not be brought to me; I do not allow it to be played, because in my youth it was my hobbyhorse. But since "we" are in a good mood today, I will play the sonata for you.', cite: 'Siloti, "Meine Erinnerungen," trans. for this demo from the 1913 German', via: 'siloti', note: 'Liszt to a young American who had brought the sonata to class. Siloti had just told him how well Anton Rubinstein played it.' },
      { kind: 'witness', who: 'siloti', text: 'When, after four bars, the G sharp entered in the right hand, I understood nothing any more. He did not bring this G sharp out, but it was a tone unknown to me, which I still hear clearly now, after 27 years.', cite: 'Siloti, "Meine Erinnerungen," trans. for this demo', via: 'siloti', note: 'Siloti also says the room was small and carpeted, 35 to 40 people were in it, and the grand was worn, uneven and out of tune.' },
    ],
  },
  {
    id: 'moon3', composer: 'Beethoven', title: 'Sonata in C sharp minor, Op. 27 No. 2, "Moonlight"', part: 'Third movement, opening',
    player: 'lamond', year: 1922, age: 54, gap: 36, label: 'HMV D 719', src: 'iaLamond', clip: 'clips/lamond-moonlight-3.mp3',
    said: [
      { kind: 'witness', who: 'siloti', text: 'He played the whole first movement, then the second; the third he only began, and said that he was too old and did not have enough physical strength to play this movement.', cite: 'Siloti, "Meine Erinnerungen," trans. for this demo', via: 'siloti' },
      { kind: 'general', who: 'riesberg', text: 'Nicht so schnell, Amerikaner.', cite: 'Riesberg, "Gala Days," 698', via: 'bowen', note: '"Not so fast, American." Liszt had taken Riesberg by the ear as he raced through unison octaves in another piece.' },
    ],
  },
  {
    id: 'source', composer: 'Liszt', title: 'Au bord d\'une source', part: 'Opening',
    player: 'dalbert', year: 1912, age: 48, gap: 30, label: 'Odeon XX 76937/76940', src: 'iaAlbert', clip: 'clips/dalbert-au-bord.mp3',
    said: [
      { kind: 'witness', who: 'fay', text: 'I was nervous and played badly. He was not to be put out, however, but acted as if he thought I had played charmingly, and then he sat down and played the whole piece himself, oh, so exquisitely! It made me feel like a wood-chopper.', cite: 'Fay, Music-Study in Germany, letter from Weimar, 1873', via: 'fay', note: 'Fay had prepared Au bord d\'une source for him.' },
      { kind: 'witness', who: 'fay', text: 'He suddenly took an unexpected chord and extemporized a poetical little end, quite different from the written one.', cite: 'Fay, Music-Study in Germany, same letter', via: 'fay' },
      { kind: 'general', who: 'fay', text: 'Keep your hand still, Fräulein; don\'t make omelette.', cite: 'Fay, Music-Study in Germany, 223', via: 'bowen', note: 'Said to Fay about a rotating passage in another piece.' },
    ],
  },
  {
    id: 'waltz', composer: 'Chopin', title: 'Waltz in A flat, Op. 42', part: 'Opening',
    player: 'dalbert', year: 1912, age: 48, gap: 30, label: 'Odeon XX 76937/76940', src: 'iaAlbert', clip: 'clips/dalbert-chopin-waltz.mp3',
    said: [
      { kind: 'composer', who: 'lamond', text: 'I don\'t want to listen to how fast you can play octaves. What I wish to hear is the canter of the horses of the Polish cavalry before they gather force and destroy the enemy.', cite: 'Lamond, Memoirs, 68', via: 'bowen', note: 'Said about the left-hand octaves in Chopin\'s Polonaise in A flat, Op. 53.' },
      { kind: 'composer', who: 'bagby', text: 'I play that well myself.', cite: 'Bagby, "Summer," 663', via: 'bowen', note: 'On seeing Chopin\'s Etude in A flat, Op. 25 No. 1, on the pile. He then sat down and played it.' },
      { kind: 'composer', who: 'siloti', text: 'conservatorium-fashion', cite: 'Siloti, Memories of Liszt, 18', via: 'bowen', note: 'Liszt\'s name for Chopin played with the groups of small notes too fast. Siloti says it irritated him.' },
    ],
  },
  {
    id: 'weber', composer: 'Weber', title: 'Aufforderung zum Tanz (Invitation to the Dance), Op. 65', part: 'The waltz begins',
    player: 'dalbert', year: 1912, age: 48, gap: 30, label: 'Odeon XX 76933', src: 'iaAlbert', clip: 'clips/dalbert-weber.mp3',
    said: [
      { kind: 'general', who: 'mason', text: 'Don\'t play it that way. Play it like this.', cite: 'Mason, Memories, 99', via: 'bowen', note: 'Mason says Liszt would sometimes push a pupil off the chair to show a passage.' },
      { kind: 'general', who: 'fay', text: 'Liszt\'s grand principle is, to leave you your freedom, and when you play to him, you feel like a Pegasus caracoling about in the air.', cite: 'Fay, Music-Study in Germany, 273', via: 'bowen' },
    ],
  },
];

export const TEACHING = [
  { head: 'Technique is not his job', text: 'I take no payment from you but, if I did, there is no money which could give you the right to come and wash your dirty linen here. I am not a washerwoman. Go to the conservatorium, that is the place for you.', who: 'Liszt, reported by Siloti', cite: 'Siloti, Memories of Liszt, 21', via: 'bowen' },
  { head: 'An image, not an instruction', text: 'Keep your hand still, Fräulein; don\'t make omelette.', who: 'Liszt, reported by Fay', cite: 'Fay, Music-Study in Germany, 223', via: 'bowen' },
  { head: 'What the octaves are for', text: 'I don\'t want to listen to how fast you can play octaves. What I wish to hear is the canter of the horses of the Polish cavalry before they gather force and destroy the enemy.', who: 'Liszt, reported by Lamond', cite: 'Lamond, Memoirs, 68', via: 'bowen' },
  { head: 'Interpretation', text: 'Interpretation was the thing. The inner meaning of the composition must be found, the spirit must be brought out.', who: 'Arthur Friedheim', cite: 'Friedheim, Life and Liszt, 52', via: 'bowen' },
  { head: 'Few words', text: 'Much of his teaching was by symbolism, by gesture, or even by grimace.', who: 'Carl Lachmund', cite: 'Lachmund, Living with Liszt, 48', via: 'bowen' },
  { head: 'The face', text: 'No one else in the world could show musical phrasing as he did, merely by the expression of his face.', who: 'Alexander Siloti', cite: 'Siloti, Memories of Liszt, 17', via: 'bowen' },
  { head: 'Keeping time with the body', text: 'You "metronomize," just like the great Clara.', who: 'Liszt, reported by a Hungarian pupil', cite: 'Papp, Liszt Ferenc élő magyar tanítványai, 78-79, cited from Alan Walker', via: 'bowen' },
  { head: 'Your own conception', text: 'He develops the very spirit of music in you. He doesn\'t keep nagging at you all the time, but he leaves you your own conception.', who: 'Amy Fay', cite: 'Fay, Music-Study in Germany, 213', via: 'bowen' },
  { head: 'Three pieces not to bring', text: 'Liszt\'s Second Hungarian Rhapsody, Beethoven\'s "Moonlight" Sonata and Chopin\'s Scherzo in B flat minor.', who: 'Listed by Siloti; summarized in Bowen', cite: 'Siloti, Memories of Liszt, 18', via: 'bowen', plain: true },
  { head: 'A dissent', text: 'Considered from the standpoint of steady, progressive work, these classes were a farce.', who: 'Edward Baxter Perry', cite: 'Perry, "How Liszt Gave Lessons," 134', via: 'bowen' },
];

export const ABOUT = [
  ['What is real', 'Every quotation is from a published account by someone who was in the room. Most wording is taken from the quotations in Bowen, "Liszt the Teacher." The Siloti and Fay passages on the "Moonlight" and Au bord d\'une source were read in the 1913 and 1883 printings. Siloti\'s German is translated for this demo.'],
  ['What the recordings are', 'Short clips from discs made by two Liszt pupils: Lamond in 1922 and d\'Albert in 1912. They were made 30 to 36 years after the lessons. Acoustic recording limited each side to about four minutes. No recording of Liszt exists.'],
  ['What is not real', 'The gathering. Fay was in Weimar in 1873, d\'Albert from 1882, Siloti from 1883 and Lamond from 1885. The room is an illustration of the music room at the Hofgärtnerei in Weimar, not a survey of it.'],
  ['What Liszt did not say', 'Liszt is not recorded commenting on these recordings. Each remark carries a label: about this piece, a witness on Liszt playing it, about the composer, or general advice.'],
  ['How it was made', 'Built with Claude Fable 5.2 from José Antonio Bowen\'s research. No tracking.'],
];
