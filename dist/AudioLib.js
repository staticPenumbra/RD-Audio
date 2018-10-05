(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AudioLib", [], factory);
	else if(typeof exports === 'object')
		exports["AudioLib"] = factory();
	else
		root["AudioLib"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/AudioLib.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/AudioController.js":
/*!********************************!*\
  !*** ./src/AudioController.js ***!
  \********************************/
/*! exports provided: AudioController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioController", function() { return AudioController; });
/* harmony import */ var _RadiusAudio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RadiusAudio */ "./src/RadiusAudio.js");
/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett”
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the implementation for the Audio controller
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
/**
 * ###############################################################################################################
 *                                              Audio Controller
 */
/**
 * @class
 * Class modeling an Audio controller
 *
 * @description
 * This is the interface for interacting with the page audio controls.  Contains all playing audio
 **/

/**
* @constructor
*/
class AudioController {
    constructor(ADChannels) {
        this.includer = new _RadiusAudio__WEBPACK_IMPORTED_MODULE_0__["RadiusAudio"]();
        this.AudioCap = 6; //The maximum number of concurrently playing audio
        this.PlayingAudio = new Array(this.AudioCap);
        //Have to Convert the NodeList to an Array here
        const Elem = document.querySelectorAll(`audio`);
        //this.Channels = Array.prototype.slice.call(Elem);
        this.FreeChannels = Array.prototype.slice.call(Elem, 0) || null;
        this.UsedChannels = new Array();
        this.ClipTimeout = null;
        this.ClipCache = new Array();
        this.Matches = new Array();
        this.Channels = Elem && Elem || null;
    }
    //----------------------------------------------SET METHODS--------------------------------------------------
    /**
    * Sets the list of available page audio clips
    * @param {RadiusAudio[]} Clips An array of current page audio clips
    */
    set UpdateAudioClips(Clips) {
        this.ClipCache = Clips;
    }
    /**
    * Sets the list of available page audio channels that the controller should manage and binds event handlers
    * @param {NodeListOf<HTMLAudioElement>} Channels The Nodelist of Audio Channels to Manage
    */
    set SetAvailableChannels(Channels) {
        if (Channels) {
            this.Channels = Channels;
            let CurrentController = this;
        }
    }
    //----------------------------------------------GET METHODS-------------------------------------------------
    /**
    * Get the Array of playing audio channels
    * @returns {Array[]} Returns the Array of playing Audio Channels
    */
    get GetPlayingAudio() {
        return (this.PlayingAudio);
    }
    /**
    * Retrieve a free channel from the pool and then set it to in use
    * @returns {AudioChannel} Free channel
    * Scan and find out if the Audio element is playing on a channel
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
    */
    RemovePlaying(ClipName, ClipIndex) {
        for (let i in this.PlayingAudio) {
            if (this.PlayingAudio[i].GetFilePath.toString() == ClipName.toString() && this.PlayingAudio[i].GetClipIdentifier == ClipIndex) {
                //We have a match; remove it
                this.PlayingAudio.splice(Number(i), 1);
                //let PreProcess = this.UsedChannels;	
                //Need to free the channel from UsedChannels Since this is a nodelist must use foreach
                this.UsedChannels.forEach(function (element, index, UsedChannels) {
                    if (element.src == ClipName.toString()) {
                        this.FreeChannels.push(UsedChannels[index]);
                        UsedChannels.splice(index, 1);
                    }
                }, this);
            }
        }
    }
    /**
    * Scan and find out if the Audio element is playing on a channel
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    * @typedef RadiusAudio[]
    * @type {Set}
    * @property {RadiusAudio}
    * @returns {RadiusAudio[]} A list of playing items matching the filters
    */
    GetPlayingItems(ClipName, ClipIndex) {
        this.Matches = new Array();
        //9/27/2018 tldr; for-of in TypeScript requires --lib dom, es6 compiler flag but then requires a manual add of each library
        //This is too much work so omitting es6 method of iteration, using c style for for compatibility with Microsoft
        for (let i = 0; i < this.PlayingAudio.length; i++) {
            //The beginning of this statement verifies that the element exists before doing any other evaluations
            if (this.PlayingAudio[i] && this.PlayingAudio[i].GetFilePath == ClipName.toString() && this.PlayingAudio[i].GetClipIdentifier == ClipIndex) {
                //We have a match; add to matches
                this.Matches.push(this.PlayingAudio[i]);
            }
        }
        //After creating match db tally up matches
        if (this.Matches.length == 0) {
            //No Matches Found
            console.log("No matches found in GetPlayingItems");
        }
        return (this.Matches);
    }
    /**
    * Stop all playing audio and reset the Audio Controller to a neutral state
    */
    Clean() {
        //Stop all playing Audio
        for (let i of this.UsedChannels) {
            i.pause();
        }
        this.PlayingAudio = null;
        this.Channels = null;
        this.FreeChannels = null;
        this.UsedChannels = null;
        this.ClipTimeout = null;
        this.ClipCache = null;
    }
    /**
    * checks to make sure there is a free channel and reserves it
    * @returns {HTMLAudioElement} Returns a reference to a free Audio Element
    */
    GetFreeChannel() {
        if (this.FreeChannels.length > 0) {
            //There Are channels available, allocate
            let channel = this.FreeChannels.pop();
            this.UsedChannels.push(channel);
            return (channel);
        }
        else {
            console.log("Allocation Error: No more free channels");
        }
    }
    /**
    * Add the RadiusAudio element to the array of playing Audio
    * @param {RadiusAudio} Audio Audio element to add to the list of playing audio tracks
    */
    AddToPlaying(Audio) {
        this.PlayingAudio.push(Audio);
    }
    //--------------------PUBLIC INTERFACE FUNCTIONS-----------------
    /**
    * Play a clip from a RadiusAudio object
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
    */
    PlayAudio(ClipName, ClipIndex) {
        let exist = this.GetPlayingItems(ClipName, ClipIndex);
        //1st thing check for a duplicate entry 
        if (exist.length == 0 && this.GetPlayingAudio) {
            //Get a free channel remember to release when done
            let Channel = this.GetFreeChannel();
            //0 indicates no channels free
            if (Channel) {
                for (let i of this.ClipCache) {
                    if (i.GetFilePath.toString() == ClipName) {
                        //We found it so assign it 
                        i.SetClipIdentifier = ClipIndex;
                        this.AddToPlaying(i);
                        Channel.src = i.GetFilePath.toString();
                        Channel.play();
                    }
                    else {
                        //There was no clip matching ClipName
                    }
                }
            }
            else {
                alert("Out of free channels");
                //No free channels
            }
        }
    }
    /**
    * Skips to the current time value in seconds given by "Value"
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    * @param {Float} Value The track starting position in seconds
    */
    SkipTo(ClipName, ClipIndex, Value) {
        let Playing = this.GetPlayingAudio;
        let Matches = Array();
        for (let i of Playing) {
            if (i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex) {
                //We have a match; add to matches
                Matches.push(i);
                //set seek
                i.SetTrackPos(Value);
            }
        }
        //After creating match db tally up matches
        if (Matches.length == 0) {
            //No Matches Found
            console.log("No matches found in SkipTo");
        }
    }
    /**
    * Stops audio associated with the object on the associated controller
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    */
    Stop(ClipName, ClipIndex) {
        let PlayingChannels = this.UsedChannels;
        let PlayingAudio = this.GetPlayingItems(ClipName, ClipIndex);
        //Only stop if there are matches
        if (PlayingAudio.length > 0) {
            for (let i of PlayingChannels) {
                //Make sure the audio is registered to a channel and playing
                if (i.src == ClipName.toString() && i.paused != true) {
                    i.pause;
                    //Remove the clip from the list
                    this.RemovePlaying(ClipName, ClipIndex);
                    //Don't forget to stop the clip on the channel
                    var found = false;
                    this.Channels.forEach(function (element) {
                        if (element.src == ClipName.toString() && found == false) {
                            //Just remove the first one encountered
                            element.pause();
                            element.currentTime = 0;
                            found = true;
                        }
                    });
                    console.log("stopped one audio track");
                }
            }
        }
        else {
            console.log("Could Not Stop audio clip because there were no matches");
        }
    }
    /**
    * Sets the specified audio clip to repeat
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    * @param {Boolean} RepeatFlag Boolean flag to set the clip to repeating
    */
    SetRepeating(ClipName, ClipIndex, Flag) {
        let Channels = this.UsedChannels;
        let AudioOBJ = this.GetPlayingItems;
        if (this.Matches.length > 0) {
            //we have a match so 
            for (let i of this.Matches) {
                i.SetRepeating(Flag);
                //Search the running Channels for the first instance
                let instance = Channels.filter(Running => Running.src === ClipName)[0];
                //Set the flag
                instance.loop = Flag;
            }
        }
        else {
            //No matches
            console.log("Cant Set Repeating flag: unknown clipname or index");
        }
    }
}


/***/ }),

/***/ "./src/AudioLib.js":
/*!*************************!*\
  !*** ./src/AudioLib.js ***!
  \*************************/
/*! exports provided: AudioController, RadiusAudio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AudioController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioController */ "./src/AudioController.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AudioController", function() { return _AudioController__WEBPACK_IMPORTED_MODULE_0__["AudioController"]; });

/* harmony import */ var _RadiusAudio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RadiusAudio */ "./src/RadiusAudio.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RadiusAudio", function() { return _RadiusAudio__WEBPACK_IMPORTED_MODULE_1__["RadiusAudio"]; });

/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett”
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the entry point for the Audio Library
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
/**
 * ###############################################################################################################
 *                                              AudioLib
 */
//Importing Dependencies



//Passthrough classes


/***/ }),

/***/ "./src/RadiusAudio.js":
/*!****************************!*\
  !*** ./src/RadiusAudio.js ***!
  \****************************/
/*! exports provided: RadiusAudio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RadiusAudio", function() { return RadiusAudio; });
/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett”
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main object implementing audio controls for the HTML5 Audio player
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
/**
 * ###############################################################################################################
 *                                              RadiusAudio
 */
/**
 * @class
 * Class modeling an Audio clip
 *
 * @description
 * The current audio output tag is operated through this Audio class
 **/
/**
* @constructor
*/
class RadiusAudio {
    constructor(TVZ_AudioFile, TVZ_Volume, TVZ_Duration, TVZ_Format) {
        this.TVZ_AudioFile = TVZ_AudioFile;
        this.TVZ_Volume = TVZ_Volume;
        this.TVZ_Duration = TVZ_Duration;
        this.TVZ_Format = TVZ_Format;
        //Default overloaded Constructor
        this.AudioFile = TVZ_AudioFile && new String(TVZ_AudioFile) || "";
        this.RepeatingFlag = false;
        this.Volume = TVZ_Volume && TVZ_Volume || 0.0;
        this.Duration = TVZ_Duration && TVZ_Duration || 0.0;
        this.Format = TVZ_Format && new String(TVZ_Format) || "mp3";
        this.Playing = false;
        this.SavedTrack = 0.0;
        this.ID = 0.0;
    }
    //-------------------------------------------------------------SET METHODS---------------------------
    /**
    * Set Repeat flag
    * @param {Boolean} Repeat Sets the Audio clip to either repeat or not repeat
    */
    set SetRepeating(Repeat) {
        this.RepeatingFlag = Repeat;
    }
    /**
    * Set Timeout
    * @param {Array[]} MinutesAndSeconds Sets the Audio clip timeout
    */
    set SetClipTimeout(MinutesAndSeconds) {
        this.Duration = MinutesAndSeconds;
    }
    /**
    * Sets the current playtime value in seconds given by "Value"
    * @param {Float} Value The track starting position in seconds
    */
    set SetTrackPos(Seconds) {
        this.SavedTrack = Seconds;
    }
    /**
    * Sets the unique instance ID of the Audio object for playing the same clip simultaneously
    * @param {number} ID A unique number ID
    */
    set SetClipIdentifier(ID) {
        this.ID = ID;
    }
    //----------------------------------------------------------GET METHODS-------------------------------
    /**
   * Sets the unique instance ID of the Audio object for playing the same clip simultaneously
   * @returns {Number} The unique number ID
   */
    get GetClipIdentifier() {
        return (Number(this.ID));
    }
    /**
    * Gets the current playtime value in seconds given by "Value"
    * @returns {Float} The current track position in seconds
    */
    get GetTrackPos() {
        return (this.SavedTrack);
    }
    /**
    * Get Timeout
    * @returns {Array[]} Gets the Audio clip timeout
    */
    get GetClipTimeout() {
        return (this.Duration);
    }
    /**
    * Get the Audio file string
    * @returns {String} Returns the AudioFile path contained in the audio object
    */
    get GetFilePath() {
        return (this.AudioFile);
    }
}


/***/ })

/******/ });
});
//# sourceMappingURL=AudioLib.js.map