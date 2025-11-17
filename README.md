# Shorts Watch Later Extension

![icon](/icons/128.png)

## About 
This very simple Chrome extension adds a Watch Later button to the videos in the Shorts tab of a channel. It looks and functions exactly like the one that appears on regular videos. If you like this extension or found it useful, I would appreciate if you starred it or even shared it with your friends. I also don't expect to work on this too much more, as I am quite satisfied with the end result.

## Background 
I had the very niche problem of not being able to add YouTube Shorts to my watch later playlist without having to first click on the Short itself, save it to the playlist, and then remove it from my watch history until I had actually seen it. For regular videos, there is an easy button that displays when hovering over the video, but not for videos on the Shorts tab. This extension changes that, at least until YouTube changes something, which breaks this. It was mostly vibe coded with ChatGPT, but some of the styling I did myself. I tried to make the button look as native as possible, even the down to the same SVGs and opacity. 

## Acknowledgements
This extension would not have been possible without code from a slightly similar [Chrome extension](https://github.com/WorldThirteen/youtube-watch-later-shortcut-ext) by Mykhailo Zachepylo (WorldThirteen) that allows you to save videos to your Watch Later playlist using a keyboard shortcut. While it was relatively easy to get the button to look good, getting it to work was much harder. I was initially experimenting with the YouTube data API with Google Cloud Console until I realized that was not necessary thanks to WorldThirteen. I may or may not have also used the same icon.

## Usage
Browse YouTube as you normally would, but now when you want to add a Short to your Watch Later playlist, simply click the button once, and a second time to remove it. You should see the buttons when navigating to the Shorts page on YouTube and even when you accidentally refresh the Shorts page. 

## Installation
1. Clone this repository or download it as a zip folder and uncompress it.
2. Navigate to `chrome://extensions` and turn on developer mode. 
3. Click on the 'Load Unpacked' button on the top left. 
4. Navigate to the uncompressed folder containing the files and select it. 
5. Optionally pin the extension to the toolbar if it is not already there. 

## Bugs
If you find one, feel free to open up a new issue or even better, create a pull request fixing it. But then again, this extension is relatively simple, so I don't expect for there to be any.

## Change Log
* v1.0 - initial release
* v1.1 - updated visuals

## Contributors
Sachin Agrawal: I'm a self-taught programmer who knows many languages and I'm into app, game, and web development. For more information, check out my website or Github profile. If you would like to contact me, my email is [github@sachin.email](mailto:github@sachin.email).

## License
This package is licensed under the [MIT License](LICENSE.txt).