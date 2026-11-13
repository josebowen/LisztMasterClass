// All teaching text and image references. Quotes are verbatim from the sources named.
const C = f => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f);
export const PHOTO = { src: C('Liszt and his students.jpg') + '?width=1600', page: 'https://commons.wikimedia.org/wiki/File:Liszt_and_his_students.jpg' };

// at: [x%, y%] of the face in the group photo. img: separate portrait. Neither: initials.
export const PEOPLE = {
  liszt: { name: 'Franz Liszt', short: 'Liszt', at: [52.4, 33.5], bio: '1811-1886. He taught in Weimar three afternoons a week and took no fee.' },
  siloti: { name: 'Alexander Siloti', short: 'Siloti', at: [23, 42], bio: '1863-1945. Pupil in Weimar, 1883-86. Front row, second from left.' },
  friedheim: { name: 'Arthur Friedheim', short: 'Friedheim', at: [43.7, 46], bio: '1859-1932. Pupil in Weimar in the 1880s. Front row, third from left.' },
  lamond: { name: 'Frederic Lamond', short: 'Lamond', img: C('Lamond 1898.jpg') + '?width=400', page: 'https://commons.wikimedia.org/wiki/File:Lamond_1898.jpg', bio: '1868-1948. Pupil in Weimar, 1885-86. Recorded from 1919.' },
  dalbert: { name: 'Eugen d’Albert', short: 'd’Albert', img: C("D'albert2.jpg") + '?width=400', page: "https://commons.wikimedia.org/wiki/File:D'albert2.jpg", bio: '1864-1932. Pupil in Weimar from 1882. Recorded for Odeon in 1912.' },
  fay: { name: 'Amy Fay', short: 'Amy Fay', img: C('AMY KAY.jpg') + '?width=400', page: 'https://commons.wikimedia.org/wiki/File:AMY_KAY.jpg', bio: '1844-1928. American pupil in Weimar, 1873.' },
  mason: { name: 'William Mason', short: 'Mason', img: C('William Mason.png') + '?width=400', page: 'https://commons.wikimedia.org/wiki/File:William_Mason.png', bio: '1829-1908. American pupil in Weimar in the 1850s.' },
  lachmund: { name: 'Carl Lachmund', short: 'Lachmund', img: 'img/lachmund.jpg', bio: '1857-1928. American pupil in Weimar, 1882-84. Kept a diary.' },
  gollerich: { name: 'August G\u00f6llerich', short: 'G\u00f6llerich', bio: '1859-1923. Pupil and secretary in Liszt\u2019s last years. Kept a diary of the classes, 1884-86.' },
  bagby: { name: 'Albert Morris Bagby', short: 'Bagby', bio: 'American pupil in Weimar.' },
  riesberg: { name: 'F. W. Riesberg', short: 'Riesberg', bio: '1863-1950. American pupil in Weimar in the mid-1880s.' },
  others: { name: 'Other witnesses', short: 'Others', bio: 'Pupils and visitors quoted once.' },
};
export const WALL = { left: ['lamond', 'dalbert', 'fay', 'mason'], right: ['lachmund', 'gollerich', 'bagby', 'riesberg', 'others'] };

// by: who is speaking. 'liszt' = Liszt's own words as reported by `who`.
const Q = (by, who, text, cite, note, disc) => ({ by, who, text, cite, note, disc });
export const TOPICS = [
  { id: 'soul', label: 'Soul before technique', quotes: [
    Q('liszt', 'siloti', 'I take no payment from you but, if I did, there is no money which could give you the right to come and wash your dirty linen here. I am not a washerwoman. Go to the conservatorium, that is the place for you.', 'Siloti, Memories of Liszt, 21'),
    Q('friedheim', 'friedheim', 'Interpretation was the thing. The inner meaning of the composition must be found, the spirit must be brought out.', 'Friedheim, Life and Liszt, 52'),
    Q('lamond', 'lamond', 'The poetical vision always arose before his mental eye, whether it was a Beethoven Sonata, a Chopin nocturne, or a work of his own.', 'Lamond, Memoirs; Bowen, note 183'),
    Q('liszt', 'lachmund', 'Do not look at the ivory; show yourself superior to that.', 'Lachmund, Living with Liszt, 51'),
  ] },
  { id: 'images', label: 'He spoke in images', quotes: [
    Q('liszt', 'fay', 'Keep your hand still, Fräulein; don’t make omelette.', 'Fay, Music-Study in Germany, 223'),
    Q('liszt', 'lamond', 'I don’t want to listen to how fast you can play octaves. What I wish to hear is the canter of the horses of the Polish cavalry before they gather force and destroy the enemy.', 'Lamond, Memoirs, 68', 'On the left-hand octaves in Chopin’s Polonaise in A flat, Op. 53.'),
    Q('lachmund', 'lachmund', 'Much of his teaching was by symbolism, by gesture, or even by grimace.', 'Lachmund, Living with Liszt, 48'),
    Q('siloti', 'siloti', 'No one else in the world could show musical phrasing as he did, merely by the expression of his face.', 'Siloti, Memories of Liszt, 17'),
  ] },
  { id: 'beethoven', label: 'Beethoven', quotes: [
    Q('liszt', 'siloti', 'Dear child, this piece may not be brought to me; I do not allow it to be played, because in my youth it was my hobbyhorse. But since “we” are in a good mood today, I will play the sonata for you.', 'Siloti, “Meine Erinnerungen an Franz Liszt” (1913), translated for this demo', 'The “Moonlight” Sonata. Siloti had just praised Anton Rubinstein’s playing of it.', 'moon1'),
    Q('siloti', 'siloti', 'When, after four bars, the G sharp entered in the right hand, I understood nothing any more. He did not bring this G sharp out, but it was a tone unknown to me, which I still hear clearly now, after 27 years.', 'Siloti, “Meine Erinnerungen” (1913), translated for this demo', 'The room was small and carpeted, 35 to 40 people were in it, and the grand was worn and out of tune.', 'moon1'),
    Q('siloti', 'siloti', 'He played the whole first movement, then the second; the third he only began, and said that he was too old and did not have enough physical strength to play this movement.', 'Siloti, “Meine Erinnerungen” (1913), translated for this demo', null, 'moon3'),
    Q('fay', 'fay', 'Perhaps it is because he feels obliged to be conscientious in teaching Beethoven!', 'Fay, Music-Study in Germany (1883 printing), 238', 'Fay on why pupils rarely dared bring him a Beethoven sonata.'),
    Q('fay', 'fay', 'He always teaches Beethoven with notes which shows how scrupulous he is about him for, of course, he knows all the sonatas by heart. He has B\u00fclow\u2019s edition, which he opens and lays in the end of the grand piano.', 'Fay, Music-Study in Germany, as quoted in Bowen, draft chapter \u201cLiszt and the New Style\u201d'),
    Q('liszt', 'gollerich', 'This piece, like scarcely any other, is a remarkable example of how precisely the unique Beethoven indicated everything. Three or four different markings are found in every bar. Not as in Bach.', 'G\u00f6llerich, diary of the master classes, as quoted in Bowen, draft chapter; page not given there', 'In a class where Rosenthal played Liszt\u2019s transcription of the Scherzo from the Ninth Symphony.'),
    Q('lachmund', 'lachmund', 'Someone wanted to play something by Bach or Beethoven, Liszt became deeply serious.', 'Lachmund, as quoted in Bowen, draft chapter; page not given there', 'Lachmund adds that Liszt followed the score when either was played.'),
    Q('liszt', 'others', 'Must be played without much nuance.', 'Quoted in Bowen, draft chapter; source not given there', 'On the opening of Beethoven\u2019s Piano Concerto in G major.'),
    Q('liszt', 'others', 'No! No! No! We know that. Come again and bring something new.', 'Otis Boise; Bowen, note 126', 'To a pupil who brought Beethoven’s Violin Sonata, Op. 24.'),
    Q('lamond', 'lamond', 'The poetical vision always arose before his mental eye, whether it was a Beethoven Sonata, a Chopin nocturne, or a work of his own.', 'Lamond, Memoirs; Bowen, note 183'),
  ] },
  { id: 'chopin', label: 'Chopin', quotes: [
    Q('liszt', 'lamond', 'I don’t want to listen to how fast you can play octaves. What I wish to hear is the canter of the horses of the Polish cavalry before they gather force and destroy the enemy.', 'Lamond, Memoirs, 68', 'Polonaise in A flat, Op. 53.'),
    Q('liszt', 'bagby', 'I play that well myself.', 'Bagby, “A Summer with Liszt in Weimar,” 663', 'On finding the Etude in A flat, Op. 25 No. 1, on the pile. He sat down and played it.'),
    Q('liszt', 'siloti', 'Conservatorium-fashion.', 'Siloti, Memories of Liszt, 18', 'His name for Chopin played with the small notes too fast. Siloti says it irritated him.', 'waltz'),
    Q('liszt', 'friedheim', 'The Governess Scherzo.', 'Friedheim and Siloti; Bowen, note 125', 'His name for the Scherzo in B flat minor, one of three pieces pupils were told not to bring.'),
  ] },
  { id: 'freedom', label: 'Your own conception', quotes: [
    Q('fay', 'fay', 'Liszt’s grand principle is, to leave you your freedom, and when you play to him, you feel like a Pegasus caracoling about in the air.', 'Fay, Music-Study in Germany, 273'),
    Q('fay', 'fay', 'He doesn’t keep nagging at you all the time, but he leaves you your own conception.', 'Fay, Music-Study in Germany, 213'),
    Q('liszt', 'mason', 'Don’t play it that way. Play it like this.', 'Mason, Memories of a Musical Life, 99', 'Mason says Liszt would push a pupil off the chair to show a passage.'),
    Q('liszt', 'others', 'Here it is, to start with, as the author must have understood it … Here it is a second time, as I feel it.', 'Jules Laurens, 1844, cited from Eigeldinger; Bowen, note 228', 'Asked how he would play a Bach prelude and fugue.'),
  ] },
  { id: 'body', label: 'Tempo and the body', quotes: [
    Q('liszt', 'others', 'You “metronomize,” just like the great Clara.', 'Papp, cited from Walker; Bowen, note 177'),
    Q('liszt', 'riesberg', 'Nicht so schnell, Amerikaner.', 'Riesberg, “Gala Days with Liszt at Weimar,” 698', '“Not so fast, American.” He had taken Riesberg by the ear.'),
    Q('liszt', 'riesberg', 'Expression does not lie in the nose! I beg you not to weave to and fro at the piano!', 'Riesberg, “Gala Days,” 738'),
    Q('liszt', 'others', 'One should not play for the people that sit in the front row and usually have free tickets, but play for those in the gallery that pay ten pfennigs for a ticket. They should not only hear but see.', 'Edwin Klahre, cited from Lachmund, 308; Bowen, note 172'),
  ] },
  { id: 'doubt', label: 'A dissent', quotes: [
    Q('others', 'others', 'Considered from the standpoint of steady, progressive work, these classes were a farce.', 'Edward Baxter Perry, “How Liszt Gave Lessons,” 134; Bowen, note 186'),
  ] },
];

export const DISCS = [
  { id: 'moon1', composer: 'Beethoven', title: '“Moonlight” Sonata', short: '\u201cMoonlight,\u201d 1st movement', part: 'First movement, opening', player: 'lamond', year: 1922, gap: 36, label: 'HMV D 718', clip: 'clips/lamond-moonlight-1.mp3', topic: 'beethoven' },
  { id: 'moon3', composer: 'Beethoven', title: '“Moonlight” Sonata', short: '\u201cMoonlight,\u201d 3rd movement', part: 'Third movement, opening', player: 'lamond', year: 1922, gap: 36, label: 'HMV D 719', clip: 'clips/lamond-moonlight-3.mp3', topic: 'beethoven' },
  { id: 'source', composer: 'Liszt', title: 'Au bord d’une source', part: 'Opening', player: 'dalbert', year: 1912, gap: 30, label: 'Odeon XX 76940', clip: 'clips/dalbert-au-bord.mp3',
    quotes: [Q('fay', 'fay', 'I was nervous and played badly. He … acted as if he thought I had played charmingly, and then he sat down and played the whole piece himself, oh, so exquisitely! It made me feel like a wood-chopper.', 'Fay, Music-Study in Germany, letter from Weimar, 1873', 'Fay had prepared Au bord d’une source for him.'), Q('fay', 'fay', 'He suddenly took an unexpected chord and extemporized a poetical little end, quite different from the written one.', 'Fay, Music-Study in Germany, same letter')] },
  { id: 'waltz', composer: 'Chopin', title: 'Waltz in A flat, Op. 42', part: 'Opening', player: 'dalbert', year: 1912, gap: 30, label: 'Odeon XX 76937', clip: 'clips/dalbert-chopin-waltz.mp3', topic: 'chopin' },
  { id: 'weber', composer: 'Weber', title: 'Invitation to the Dance', part: 'Opening', player: 'dalbert', year: 1912, gap: 30, label: 'Odeon XX 76933', clip: 'clips/dalbert-weber.mp3', topic: 'freedom' },
];

export const ABOUT = [
  ['What is real', 'Every quotation is from a published account by someone who was there. Most wording is taken from José Antonio Bowen, “Liszt the Teacher,” Journal of the American Liszt Society 52/53 (2002/03), with its page citations. Siloti on the “Moonlight” and Fay on Au bord d’une source were read in the 1913 and 1883 printings. Siloti’s German is translated for this demo.'],
  ['Liszt’s words and his pupils’ words', 'A gold bubble is Liszt speaking, as a pupil wrote it down. A cream bubble is the pupil speaking about him. No recording of Liszt exists.'],
  ['The recordings', 'Clips from discs by two pupils: Frederic Lamond (HMV, 1922) and Eugen d’Albert (Odeon, 1 July 1912), from transfers at the Internet Archive. They were made 30 to 36 years after the lessons. Liszt is not recorded commenting on them.'],
  ['The photographs', 'The portrait of Carl Lachmund was supplied by Jos\u00e9 Antonio Bowen. The group photograph is by Louis Held (1851-1927) and shows Liszt with pupils in Weimar; names follow the Wikimedia Commons caption. The file is a later colorized copy, shown here in sepia. Lamond, d’Albert, Fay and Mason are separate portraits from Wikimedia Commons. Lamond and d’Albert are not in the group photograph. People shown by initials have no portrait here.'],
  ['How it was made', 'Built with Claude Fable 5.2 from José Antonio Bowen’s research. No tracking.'],
];
export const LINKS = [
  ['Bowen, “Liszt the Teacher” (PDF)', 'https://weteachwithai.com/wp-content/uploads/2026/11/Bowen-Liszt-the-Teacher-Journal-of-the-American-Liszt-Society.pdf'],
  ['Bowen and Bomberger, annotated bibliography of sources (PDF)', 'https://weteachwithai.com/wp-content/uploads/2026/11/BowenBomberger-Liszt-Teaching-Sources-Biblio-FINAL.pdf'],
  ['Lamond, “Moonlight” Sonata, HMV D 718-719, 1922 (Internet Archive)', 'https://archive.org/details/1922-moonlight-sonata-c-sharp-minor-beethoven-frederic-lamond-hmv-d-718-3-sides'],
  ['d’Albert, Odeon, 1912 (Internet Archive)', 'https://archive.org/details/1-eugen-d-albert-odeon-xx-76933-weber-1912'],
  ['Group photograph by Louis Held (Wikimedia Commons)', PHOTO.page],
  ['Portrait of Lamond (Wikimedia Commons)', PEOPLE.lamond.page], ['Portrait of d’Albert (Wikimedia Commons)', PEOPLE.dalbert.page], ['Portrait of Amy Fay (Wikimedia Commons)', PEOPLE.fay.page], ['Portrait of William Mason (Wikimedia Commons)', PEOPLE.mason.page],
];
