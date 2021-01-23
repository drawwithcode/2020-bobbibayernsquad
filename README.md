<!--- put all the images in an "images" folder --->
![Header](images/header.png)

### Table of Contents
1. [The project](#the-project) <br>
  1a. [Idea](#idea) <br>
  1b. [Goals](#goals) <br>
  1c. [Context](#context) <br>
2. [Architecture](#architecture) <br>
  2a. [Experience 1](#experience-1) <br>
  2b. [Experience 2](#experience-2) <br>
  2c. [Experience 3](#experience-3) <br>
  2c. [Experience 4](#experience-4) <br>
3. [Design](#design) <br>
  3a. [Visuals](#visuals) <br>
  3b. [Sounds](#sounds) <br>
  3c. [Interactions](#interactions) <br>
  3c. [Design challenges](#design-challenges) <br>
4. [Coding challenges](#coding-challenges) <br>
5. [References](#references) <br>
6. [Credits](#credits) <br>
7. [Team members](#team-members) <br>
8. [Course](#course) <br>

<!--- --------------------OK------------------------- --->

## The project
Loss of Senses is a web app that goes beyond the typical digital experience. It offers you, the user, the possibility to discover a new way of seeing, that doesn't rely on the eyes - or at least not your own. There is no darkness when there is communication. <br>

### Idea
It's a visual world and people respond to visuals. We live our life through different senses, but now more than ever we are all heavy consumers of visual content. <br>

More than a lot of our everyday activities, the interactions that we have with our electronic devices strongly rely on visuals and the use of sight. So, we mainly live the internet through our eyes. What if we weren’t given the possibility to use them? <br>

### Goals
Loss of Senses aims at proposing a different, innovative experience on the theme of blindness and on the more specific theme of "blind-interaction" with the digital world. The single experiences represent indeed the everyday challenges blind people have to face, or they address the thematic of assistance to blind people. The website as a whole, on the other side, is itself an experience that aims at raising awareness on the theme "blind-interaction" with the digital world.
Loss of Senses wants to provide an uncommon, alternative, web experience, in which the sight loses power in favour of the hearing, and thus wants to show that there can be an alternative way of approaching the digital world, based on sounds rather than visuals. <br>

### Context
txt <br>

## Architecture
The first page of the website consists in a "transition page" necessary for the activation of the sounds when entering the real website. The real first page welcomes the user and it provides a brief instruction on the functioning of the whole website. By proceeding, the user must choose between the "blind" or the "assistant" modality. This choice is functional to redirect the user to the map of the experiences he/she can access to according to the modality selected. However, such modality can be easily changed later on. In both cases, the user will enter a page representing a map of the experiences available. In the case of "blind modality" the user will be able to access all the experiences, two of which are collaborative. On the contrary in the case of "assistant modality" the user will be able to access only the collaborative experiences. The modality defines the role of the user in the experiences, and it can be changed whenever the user wants when he's on the experiences' map. The collaborative experiences pair up users who have selected different modalities two by two. When only a user has entered these experiences, he/she will have to wait in a waiting room for the other user to join, or can decide whether to try the non-collaborative experiences by selecting the "blind modality". <br>

### Experience 1
The first experience, carried out in blind modality, is a simple experience focused on environmental sounds recognition. The user will have to guess for six rounds the origin of the sounds he will hear, by matching them with the corresponding labels. The sounds are recorded in different places all over the world, both in urban and natural contexts, so the user will need to pay attention to several details, including the language of the voices, the weather conditions etc... <br>

### Experience 2
The second experience is aimed at providing the user an everyday experience of blindness. The goal for the blind user is to pat on a desk and find, among several objects casually placed, a target object, represented by a bell. The user will click all over the screen to attempts, and will hear different sounds according to the objects he touches, including the desk itself. When the user finds the target object the experience is concluded and the image of the desk with all the objects in their position is display. <br>

### Experience 3
The third experience is a collaborative experience that involves users two by two, one in the role of the blind and the other in the role of the assistant. Hence, it can only be accessed when two users, one who has selected the "blind modality" and the other one who has selected the "assistant modality", enter the experience at the same time. The aim for the blind user is, by moving with the four arrows, to get out of a maze. He will see a completely dark screen except from a short radius circle around him (which represents the help of a stick), and he will need to be guided by the other user, the assistant, through sound signals. The assistant has, on the other hand, a full view on the maze and on the blind user, who he must guide throughout of the maze by positioning sounds sources by clicking on the screen. The sound signals guide the blind user by means of the note and frequency of the signals emitted: he will be able to understand if he's proceeding in the right direction and his proximity to the source of the signal.<br>

### Experience 4
The fourth experience is very similar to the third one. The concept is exactly the same, i.e. one of the two users, the assistant, guides the blind user according to the aforementioned modality by positioning sound sources on the screen. However, the context is different: the aim for the blind is to cross a series of streets avoiding the vehicles. Hence he will need to proceed carefully, and the assistant will need to indicate him when to stop, when to proceed and in which direction. This experience represents a more common and everyday experience with respect to the maze, and the complexity is given by the presence of moving obstacles rather than a complicated path to follow.  <br>

## Design and visuals
Since the theme of the project is blindness, the visual design of the website is kept as minimal and simple as possible, as it represents a secondary feature. From the very first page, the website has a dark appearance, and it is deprived of any graphic decorative element. The only constant decorative element that characterises the whole website is represented by the texts, written both in latin and braille alphabet, due to symbolic and aesthetic reasons. The font chosen for the latin alphabet is "AhamonoMonospaced", and was chosen because of its simplicity.
The key characteristic is represented by the fact that the website changes appearance according to the modality selection. Hence, when the "blind modality" is selected the website maintains its dark appearance, while in the case of "assistant modality" the website switches to a white screen, complementary to the dark one. <br>

### Sounds
The sound design represents a key aspect of the whole web experience. The main objective was giving an idea to the user on how assistive technologies ( AT ) help blind people interacting with the screen. In order to do so, we replicated a screen reader, which is a common technology that renders text (and image) content as speech. Moreover, such screen reader is also the main mean thanks to which we obtain an inclusive and accessible web experience for blind people, which clearly represented a more ambitious goal. For the same reason, each interaction of the user with the screen is accompanied by a sound (i.e. the clicking on buttons).
Moreover, thanks to the screen reader, the non-blind user can try, by closing his eyes, to surf the website completely "in the dark", following the sound instructions. In this way we hope to raise awareness on the theme and provide a different, innovative point of view on web experiences.
Moreover, the single experiences are characterised by very different sound designs: the first one is focused on environmental sounds, both recorded in natural and urban contexts all over the world. These recordings are rich of details, which are necessary in order to make the experience significant and to introduce a certain level of complexity. The second experience is focused on sounds of everyday objects, indeed the ones that can be commonly found on a desk. In the third and fourth experiences the main goal was the design of a sound signal that, emitted by the assistant, could actually guide the blind user throughout the experience. We'll cover in detail this topic in the next section, as these sound signals represent the modality of interaction between users.
 <br>

### Interactions
Let us analyse the interactions between users in the collaborative experiences. In both the 3rd and 4th experiences, the user who has selected the "assistant modality" guides the user in "blind modality". By clicking on the screen, he sets the position of the sound signal source. Such sound signal is characterised by a certain frequency, which indicates in which direction the blind user should proceed, and by the frequency of the bleeps emitted (i.e. the number of bleeps in a fixed interval of time), which increases as the the blind user approaches the sound source. On the other hand the blind user cannot communicate directly with the the assistant: however, his position will always be displayed to the assistant, who must consequently decide how to guide him. <br>

### Design challenges
The greatest challenge was represented by the fact that sight is the main sense involved in digital experiences, while our aim was to develop a website accessible to blind people, or that at least represented a significant experience for non-blind users on the theme of blindness and "blind interaction" with the digital world.
Hence, we had to develop a website that was as minimal as possible on a visual level, yet not completely naked and still pleasant to the eye. Moreover the sound design represented a key aspect that had to be taken care of in all its details, which resulted in a fairly consistent amount of work.
Finally, the complex and rich structure of the website, implied that taking care of every aspect and detail for each page was a long and hard procedure. <br>

## Coding challenges
In the developing process, we inevitably encountered a few difficulties when it was time to put ideas into code. Here are some of our major coding challenges and how we faced and solved them to achieve the final result:

- **summary1** <br>
txt

```javascript
function setup(){
}

 ```

- **summary2** <br>
 txt

 ```javascript
 function setup(){
 }

  ```

## References
[Dialogo nel Buio](https://www.dialogonelbuio.org/index.php/it/) -
The starting idea that led to the development of the project drew inspiration from the awareness raising exhibition Dialogo nel Buio ("Dialogue in the Dark"). <br>

[Trip in the dark](https://tripinthedark.ru/en/) -
Source of inspiration as a website that can be experienced through different senses. <br>

[The Coding Train](https://thecodingtrain.com/) -
Bless Daniel Shiffman for the best instructional videos on how to program with p5.js. Always helpful no matter what. <br>

[W3Schools] (https://www.w3schools.com/) -
Online tutorials on HTML and CSS have never been more useful. <br>

## Credits
[P5js](https://p5js.org/) -
The JavaScript library that we used to develop all the main graphics in our website, thanks to the coding techniques we learned during the course.<br>

[Heroku](https://www.heroku.com/) -
The cloud platform we used to publish the website, through GitHub.<br>

[Ahamono](https://www.behance.net/gallery/19532783/AhamonoMonospaced) -
The font we used for thw whole website, by Alfredo Marco Pradil.<br>

[Zasplat](https://www.zapsplat.com/) -
The website we used to freely download sound effects.<br>

## Team members
* [Jean Paul Guglielmo Baroni](https://github.com/jpgbaroni)
* [Chiara Caputo](https://github.com/chcapu)
* [Maurizio Cerisola](https://github.com/MaurizioCerisola)
* [Chiara Cozzarini](https://github.com/chiaracozzarini)

## Course:
[Creative Coding 2020/2021](https://drawwithcode.github.io/2020/)<br>
**Politecnico di Milano** - Scuola del Design<br>
**Faculty:** Michele Mauri, Tommaso Elli, Andrea Benedetti
