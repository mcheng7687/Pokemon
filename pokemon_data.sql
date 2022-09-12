--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: evolution; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.evolution (
    pre_evolve_id integer NOT NULL,
    post_evolve_id integer NOT NULL
);


ALTER TABLE public.evolution OWNER TO "Melvin";

--
-- Name: pokemon; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.pokemon (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    species integer NOT NULL
);


ALTER TABLE public.pokemon OWNER TO "Melvin";

--
-- Name: pokemon_type; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.pokemon_type (
    pokemon_id integer,
    type text
);


ALTER TABLE public.pokemon_type OWNER TO "Melvin";

--
-- Name: trainer; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.trainer (
    id integer NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password text NOT NULL,
    isadmin boolean DEFAULT false
);


ALTER TABLE public.trainer OWNER TO "Melvin";

--
-- Name: trainer_id_seq; Type: SEQUENCE; Schema: public; Owner: Melvin
--

CREATE SEQUENCE public.trainer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trainer_id_seq OWNER TO "Melvin";

--
-- Name: trainer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Melvin
--

ALTER SEQUENCE public.trainer_id_seq OWNED BY public.trainer.id;


--
-- Name: trainer_pokemon; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.trainer_pokemon (
    id integer NOT NULL,
    trainer_id integer,
    pokemon_id integer,
    hunger integer DEFAULT 0
);


ALTER TABLE public.trainer_pokemon OWNER TO "Melvin";

--
-- Name: trainer_pokemon_id_seq; Type: SEQUENCE; Schema: public; Owner: Melvin
--

CREATE SEQUENCE public.trainer_pokemon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trainer_pokemon_id_seq OWNER TO "Melvin";

--
-- Name: trainer_pokemon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Melvin
--

ALTER SEQUENCE public.trainer_pokemon_id_seq OWNED BY public.trainer_pokemon.id;


--
-- Name: types; Type: TABLE; Schema: public; Owner: Melvin
--

CREATE TABLE public.types (
    type text NOT NULL,
    color text NOT NULL
);


ALTER TABLE public.types OWNER TO "Melvin";

--
-- Name: trainer id; Type: DEFAULT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer ALTER COLUMN id SET DEFAULT nextval('public.trainer_id_seq'::regclass);


--
-- Name: trainer_pokemon id; Type: DEFAULT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer_pokemon ALTER COLUMN id SET DEFAULT nextval('public.trainer_pokemon_id_seq'::regclass);


--
-- Data for Name: evolution; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.evolution (pre_evolve_id, post_evolve_id) FROM stdin;
1	2
2	3
4	5
5	6
7	8
8	9
10	11
11	12
13	14
14	15
16	17
17	18
19	20
21	22
23	24
25	26
27	28
29	30
30	31
32	33
33	34
35	36
37	38
39	40
41	42
43	44
44	45
46	47
48	49
50	51
52	53
54	55
56	57
58	59
60	61
61	62
63	64
64	65
66	67
67	68
69	70
70	71
72	73
74	75
75	76
77	78
79	80
81	82
84	85
86	87
88	89
90	91
92	93
93	94
96	97
98	99
100	101
102	103
104	105
109	110
111	112
116	117
118	119
120	121
129	130
133	134
133	135
133	136
138	139
140	141
147	148
148	149
\.


--
-- Data for Name: pokemon; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.pokemon (id, name, image_url, species) FROM stdin;
1	Bulbasaur	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png	1
2	Ivysaur	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/2.png	1
3	Venusaur	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/3.png	1
4	Charmander	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/4.png	2
5	Charmeleon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/5.png	2
6	Charizard	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/6.png	2
7	Squirtle	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/7.png	3
8	Wartortle	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/8.png	3
9	Blastoise	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/9.png	3
10	Caterpie	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10.png	4
11	Metapod	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/11.png	4
12	Butterfree	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/12.png	4
13	Weedle	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/13.png	5
14	Kakuna	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/14.png	5
15	Beedrill	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/15.png	5
16	Pidgey	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/16.png	6
17	Pidgeotto	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/17.png	6
18	Pidgeot	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/18.png	6
19	Rattata	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/19.png	7
20	Raticate	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/20.png	7
21	Spearow	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/21.png	8
22	Fearow	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/22.png	8
23	Ekans	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/23.png	9
24	Arbok	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/24.png	9
25	Pikachu	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png	10
26	Raichu	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/26.png	10
27	Sandshrew	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/27.png	11
28	Sandslash	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/28.png	11
29	Nidoran-f	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/29.png	12
30	Nidorina	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/30.png	12
31	Nidoqueen	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/31.png	12
32	Nidoran-m	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/32.png	13
33	Nidorino	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/33.png	13
34	Nidoking	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/34.png	13
35	Clefairy	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png	14
36	Clefable	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/36.png	14
37	Vulpix	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/37.png	15
38	Ninetales	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/38.png	15
39	Jigglypuff	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/39.png	16
40	Wigglytuff	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/40.png	16
41	Zubat	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/41.png	17
42	Golbat	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/42.png	17
43	Oddish	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/43.png	18
44	Gloom	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/44.png	18
45	Vileplume	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/45.png	18
46	Paras	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/46.png	19
47	Parasect	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/47.png	19
48	Venonat	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/48.png	20
49	Venomoth	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/49.png	20
50	Diglett	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/50.png	21
51	Dugtrio	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/51.png	21
52	Meowth	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/52.png	22
53	Persian	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/53.png	22
54	Psyduck	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/54.png	23
55	Golduck	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/55.png	23
56	Mankey	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/56.png	24
57	Primeape	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/57.png	24
58	Growlithe	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/58.png	25
59	Arcanine	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/59.png	25
60	Poliwag	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/60.png	26
61	Poliwhirl	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/61.png	26
62	Poliwrath	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/62.png	26
63	Abra	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/63.png	27
64	Kadabra	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/64.png	27
65	Alakazam	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/65.png	27
66	Machop	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/66.png	28
67	Machoke	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/67.png	28
68	Machamp	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/68.png	28
69	Bellsprout	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/69.png	29
70	Weepinbell	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/70.png	29
71	Victreebel	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/71.png	29
72	Tentacool	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/72.png	30
73	Tentacruel	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/73.png	30
74	Geodude	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/74.png	31
75	Graveler	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/75.png	31
76	Golem	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/76.png	31
77	Ponyta	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/77.png	32
78	Rapidash	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/78.png	32
79	Slowpoke	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/79.png	33
80	Slowbro	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/80.png	33
81	Magnemite	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/81.png	34
82	Magneton	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/82.png	34
83	Farfetchd	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/83.png	35
84	Doduo	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/84.png	36
85	Dodrio	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/85.png	36
86	Seel	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/86.png	37
87	Dewgong	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/87.png	37
88	Grimer	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/88.png	38
89	Muk	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/89.png	38
90	Shellder	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/90.png	39
91	Cloyster	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/91.png	39
92	Gastly	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/92.png	40
93	Haunter	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/93.png	40
94	Gengar	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/94.png	40
95	Onix	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/95.png	41
96	Drowzee	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/96.png	42
97	Hypno	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/97.png	42
98	Krabby	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/98.png	43
99	Kingler	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/99.png	43
100	Voltorb	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/100.png	44
101	Electrode	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/101.png	44
102	Exeggcute	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/102.png	45
103	Exeggutor	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/103.png	45
104	Cubone	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/104.png	46
105	Marowak	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/105.png	46
106	Hitmonlee	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/106.png	47
107	Hitmonchan	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/107.png	47
108	Lickitung	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/108.png	48
109	Koffing	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/109.png	49
110	Weezing	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/110.png	49
111	Rhyhorn	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/111.png	50
112	Rhydon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/112.png	50
113	Chansey	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/113.png	51
114	Tangela	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/114.png	52
115	Kangaskhan	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/115.png	53
116	Horsea	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/116.png	54
117	Seadra	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/117.png	54
118	Goldeen	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/118.png	55
119	Seaking	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/119.png	55
120	Staryu	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/120.png	56
121	Starmie	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/121.png	56
122	Mr-mime	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/122.png	57
123	Scyther	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/123.png	58
124	Jynx	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/124.png	59
125	Electabuzz	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/125.png	60
126	Magmar	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/126.png	61
127	Pinsir	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/127.png	62
128	Tauros	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/128.png	63
129	Magikarp	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/129.png	64
130	Gyarados	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/130.png	64
131	Lapras	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/131.png	65
132	Ditto	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/132.png	66
133	Eevee	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/133.png	67
134	Vaporeon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/134.png	67
135	Jolteon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/135.png	67
136	Flareon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/136.png	67
137	Porygon	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/137.png	68
138	Omanyte	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/138.png	69
139	Omastar	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/139.png	69
140	Kabuto	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/140.png	70
141	Kabutops	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/141.png	70
142	Aerodactyl	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/142.png	71
143	Snorlax	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/143.png	72
144	Articuno	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/144.png	73
145	Zapdos	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/145.png	74
146	Moltres	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/146.png	75
147	Dratini	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/147.png	76
148	Dragonair	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/148.png	76
149	Dragonite	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/149.png	76
150	Mewtwo	https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/150.png	77
\.


--
-- Data for Name: pokemon_type; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.pokemon_type (pokemon_id, type) FROM stdin;
1	grass
1	poison
2	grass
2	poison
3	grass
3	poison
4	fire
5	fire
6	fire
6	flying
7	water
8	water
9	water
10	bug
11	bug
12	bug
12	flying
13	bug
13	poison
14	bug
14	poison
15	bug
15	poison
16	normal
16	flying
17	normal
17	flying
18	normal
18	flying
19	normal
20	normal
21	normal
21	flying
22	normal
22	flying
23	poison
24	poison
25	electric
26	electric
27	ground
28	ground
29	poison
30	poison
31	poison
31	ground
32	poison
33	poison
34	poison
34	ground
35	fairy
36	fairy
37	fire
38	fire
39	normal
39	fairy
40	normal
40	fairy
41	poison
41	flying
42	poison
42	flying
43	grass
43	poison
44	grass
44	poison
45	grass
45	poison
46	bug
46	grass
47	bug
47	grass
48	bug
48	poison
49	bug
49	poison
50	ground
51	ground
52	normal
53	normal
54	water
55	water
56	fighting
57	fighting
58	fire
59	fire
60	water
61	water
62	water
62	fighting
63	psychic
64	psychic
65	psychic
66	fighting
67	fighting
68	fighting
69	grass
69	poison
70	grass
70	poison
71	grass
71	poison
72	water
72	poison
73	water
73	poison
74	rock
74	ground
75	rock
75	ground
76	rock
76	ground
77	fire
78	fire
79	water
79	psychic
80	water
80	psychic
81	electric
81	steel
82	electric
82	steel
83	normal
83	flying
84	normal
84	flying
85	normal
85	flying
86	water
87	water
87	ice
88	poison
89	poison
90	water
91	water
91	ice
92	ghost
92	poison
93	ghost
93	poison
94	ghost
94	poison
95	rock
95	ground
96	psychic
97	psychic
98	water
99	water
100	electric
101	electric
102	grass
102	psychic
103	grass
103	psychic
104	ground
105	ground
106	fighting
107	fighting
108	normal
109	poison
110	poison
111	ground
111	rock
112	ground
112	rock
113	normal
114	grass
115	normal
116	water
117	water
118	water
119	water
120	water
121	water
121	psychic
122	psychic
122	fairy
123	bug
123	flying
124	ice
124	psychic
125	electric
126	fire
127	bug
128	normal
129	water
130	water
130	flying
131	water
131	ice
132	normal
133	normal
134	water
135	electric
136	fire
137	normal
138	rock
138	water
139	rock
139	water
140	rock
140	water
141	rock
141	water
142	rock
142	flying
143	normal
144	ice
144	flying
145	electric
145	flying
146	fire
146	flying
147	dragon
148	dragon
149	dragon
149	flying
150	psychic
\.


--
-- Data for Name: trainer; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.trainer (id, email, first_name, last_name, password, isadmin) FROM stdin;
\.


--
-- Data for Name: trainer_pokemon; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.trainer_pokemon (id, trainer_id, pokemon_id, hunger) FROM stdin;
\.


--
-- Data for Name: types; Type: TABLE DATA; Schema: public; Owner: Melvin
--

COPY public.types (type, color) FROM stdin;
normal	white
fighting	tan
flying	white
poison	green
ground	tan
rock	tan
bug	green
ghost	purple
steel	gray
fire	red
water	blue
grass	green
electric	yellow
psychic	purple
ice	blue
dragon	white
dark	black
fairy	white
shadow	purple
\.


--
-- Name: trainer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Melvin
--

SELECT pg_catalog.setval('public.trainer_id_seq', 1, true);


--
-- Name: trainer_pokemon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Melvin
--

SELECT pg_catalog.setval('public.trainer_pokemon_id_seq', 1, true);


--
-- Name: evolution evolution_pkey; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.evolution
    ADD CONSTRAINT evolution_pkey PRIMARY KEY (pre_evolve_id, post_evolve_id);


--
-- Name: pokemon pokemon_pkey; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.pokemon
    ADD CONSTRAINT pokemon_pkey PRIMARY KEY (id);


--
-- Name: trainer trainer_email_key; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer
    ADD CONSTRAINT trainer_email_key UNIQUE (email);


--
-- Name: trainer trainer_pkey; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer
    ADD CONSTRAINT trainer_pkey PRIMARY KEY (id);


--
-- Name: trainer_pokemon trainer_pokemon_pkey; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer_pokemon
    ADD CONSTRAINT trainer_pokemon_pkey PRIMARY KEY (id);


--
-- Name: types types_pkey; Type: CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (type);


--
-- Name: evolution evolution_post_evolve_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.evolution
    ADD CONSTRAINT evolution_post_evolve_id_fkey FOREIGN KEY (post_evolve_id) REFERENCES public.pokemon(id) ON DELETE CASCADE;


--
-- Name: evolution evolution_pre_evolve_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.evolution
    ADD CONSTRAINT evolution_pre_evolve_id_fkey FOREIGN KEY (pre_evolve_id) REFERENCES public.pokemon(id) ON DELETE CASCADE;


--
-- Name: pokemon_type pokemon_type_pokemon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.pokemon_type
    ADD CONSTRAINT pokemon_type_pokemon_id_fkey FOREIGN KEY (pokemon_id) REFERENCES public.pokemon(id) ON DELETE CASCADE;


--
-- Name: pokemon_type pokemon_type_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.pokemon_type
    ADD CONSTRAINT pokemon_type_type_fkey FOREIGN KEY (type) REFERENCES public.types(type);


--
-- Name: trainer_pokemon trainer_pokemon_pokemon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer_pokemon
    ADD CONSTRAINT trainer_pokemon_pokemon_id_fkey FOREIGN KEY (pokemon_id) REFERENCES public.pokemon(id) ON DELETE CASCADE;


--
-- Name: trainer_pokemon trainer_pokemon_trainer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Melvin
--

ALTER TABLE ONLY public.trainer_pokemon
    ADD CONSTRAINT trainer_pokemon_trainer_id_fkey FOREIGN KEY (trainer_id) REFERENCES public.trainer(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

