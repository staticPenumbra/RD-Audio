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
import { RadiusAudio } from './RadiusAudio';
/**
* @constructor
*/
export class AudioController {
    constructor(ADChannels) {
        this.includer = new RadiusAudio();
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
