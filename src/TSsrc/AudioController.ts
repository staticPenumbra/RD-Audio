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

import {RadiusAudio} from './RadiusAudio';

 /**
 * @constructor
 */
export class AudioController{
	private PlayingAudio: RadiusAudio[];
	private Channels: NodeListOf<HTMLAudioElement>;
	private FreeChannels: HTMLAudioElement[];
	private UsedChannels: HTMLAudioElement[];
	private ClipTimeout: number;
	private ClipCache: RadiusAudio[];
	private Matches: RadiusAudio[];
	private AudioCap: number;
	private includer: RadiusAudio;

    constructor(ADChannels?: NodeListOf<HTMLAudioElement>){
		this.includer = new RadiusAudio();
		this.AudioCap = 6; //The maximum number of concurrently playing audio
		this.PlayingAudio = new Array<RadiusAudio>(this.AudioCap);
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
    set UpdateAudioClips(Clips:  RadiusAudio[]){
	    	this.ClipCache = Clips;
    }
    /**
    * Sets the list of available page audio channels that the controller should manage and binds event handlers
    * @param {NodeListOf<HTMLAudioElement>} Channels The Nodelist of Audio Channels to Manage
    */
    set SetAvailableChannels(Channels: NodeListOf<HTMLAudioElement>){
		   if(Channels){
				this.Channels = Channels;
				let CurrentController = this;
				//----------BEGIN DELETE--------------------
				//Bind channel event listeners(THIS CAN BE DELETED IF NOT USED)
				for(let i = 0; i < Channels.length; i++){
					//Bind channel event listeners(THIS CAN BE DELETED IF NOT USED)
					Channels[i].onended = function Test(e){CurrentController.AudioEnded(this, e)};
				}
				//----------END DELETE---------------------
		   }
	}
	//----------------------------------------------PLACE EVENT HANDLERS HERE(OR DELETE THIS SECTION)------------------------------------------------
	//---------------BEGIN DELETE------------------------
	/**
    * AudioEnded Event Handler for the Channels(CAN BE DELETED)
    */
  	private AudioEnded(Ele: HTMLElement, Ev: Event){
		//Dont do anything?
	}
	//--------------END DELETE-----------------------------
    //----------------------------------------------GET METHODS-------------------------------------------------
	/**
    * Get the Array of playing audio channels
    * @returns {Array[]} Returns the Array of playing Audio Channels
    */
    get GetPlayingAudio(){
            return(this.PlayingAudio);
    }
    /**
    * Retrieve a free channel from the pool and then set it to in use
    * @returns {AudioChannel} Free channel 
    * Scan and find out if the Audio element is playing on a channel
   	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
    */
   	private RemovePlaying(ClipName: String, ClipIndex: Number){
		for(let i in this.PlayingAudio){
			if(this.PlayingAudio[i].GetFilePath.toString() == ClipName.toString() && this.PlayingAudio[i].GetClipIdentifier == ClipIndex){
				//We have a match; remove it
				this.PlayingAudio.splice(Number(i), 1);
				//let PreProcess = this.UsedChannels;	
				//Need to free the channel from UsedChannels Since this is a nodelist must use foreach
				this.UsedChannels.forEach(function(element, index, UsedChannels){
					if(element.src == ClipName.toString()){
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
   	private GetPlayingItems(ClipName: String, ClipIndex: Number){
		this.Matches = new Array();
		//9/27/2018 tldr; for-of in TypeScript requires --lib dom, es6 compiler flag but then requires a manual add of each library
		//This is too much work so omitting es6 method of iteration, using c style for for compatibility with Microsoft
		for(let i = 0; i < this.PlayingAudio.length; i++){
			//The beginning of this statement verifies that the element exists before doing any other evaluations
			if(this.PlayingAudio[i] && this.PlayingAudio[i].GetFilePath == ClipName.toString() && this.PlayingAudio[i].GetClipIdentifier == ClipIndex){
				//We have a match; add to matches
				this.Matches.push(this.PlayingAudio[i]);	
			}
		}
		//After creating match db tally up matches
		if(this.Matches.length == 0){
			//No Matches Found
			console.log("No matches found in GetPlayingItems");
		}
		return(this.Matches);
	}	
	/**
    * Event listener for an audio clip ending
    * @param {AudioController} instance A pointer to the running AudioController instance
    * @param {DOMElement[]} Channels A reference to the array of Audio channels from DOM
    */
    /*private AudioEnded(instance: AudioController, Channels: HTMLAudioElement[]){
	    if(instance != null){
		    let Audio = instance.PlayingAudio;
		    let Free = instance.FreeChannels;
		    for(let i of this.PlayingAudio){
			    let item = i.GetFilePath; //Yes no parens are correct syntax
			    if(item == Channels.getAttribute().currentTarget.currentSrc){
				    //We've found the audio item so release the controller
				    let controller = Audio[i].GetController();
				    Free.push(controller);
				    Audio.splice(i, 1);
			    }
		    }
	    }
	}*/
	/**
	* Stop all playing audio and reset the Audio Controller to a neutral state
	*/
	private Clean(){
		//Stop all playing Audio
		for(let i of this.UsedChannels){
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
	private GetFreeChannel(){
		if(this.FreeChannels.length > 0){
			//There Are channels available, allocate
			let channel = this.FreeChannels.pop();
			this.UsedChannels.push(channel);
			return(channel);
		}else{
			console.log("Allocation Error: No more free channels")
		}
	}
	/**
	* Add the RadiusAudio element to the array of playing Audio
	* @param {RadiusAudio} Audio Audio element to add to the list of playing audio tracks
	*/
	private AddToPlaying(Audio: RadiusAudio){
			//Remove the first Array Element and Stop Audio
			/*if(this.PlayingAudio[0]){
				this.Stop(this.PlayingAudio[0].GetFilePath.toString(), this.PlayingAudio[0].GetClipIdentifier);
			}
			this.PlayingAudio.splice(0, 1);*/

			//Add to the end, officially making it a queue
			this.PlayingAudio.push(Audio);
	}
	//--------------------PUBLIC INTERFACE FUNCTIONS-----------------
	/**
	* Play a clip from a RadiusAudio object
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
	*/
	//LOGIC FLOW
	//*Get a free channel
	//*Assign variables to the free channel
	//*Set the channel to play
	//*Add Channel to the list of playing Channels
	public PlayAudio(ClipName: String, ClipIndex: Number){
		let exist = this.GetPlayingItems(ClipName, ClipIndex);
		//1st thing check for a duplicate entry 
		if(exist.length == 0 && this.GetPlayingAudio){
			//Get a free channel remember to release when done
			let Channel: HTMLAudioElement = this.GetFreeChannel();
			//0 indicates no channels free
			if(Channel){
				for(let i of this.ClipCache){
					if(i.GetFilePath.toString() == ClipName){
					//We found it so assign it 
						i.SetClipIdentifier = ClipIndex;
						this.AddToPlaying(i);
						Channel.src = i.GetFilePath.toString();
						Channel.play();
					}else{
					//There was no clip matching ClipName
					}
				}
			}else{
				alert("Out of free channels")
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
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*If we find it then stop the track and set the start time to Value
	//*Set the channel to play
	public SkipTo(ClipName: String, ClipIndex: Number, Value: number) {
		let Playing = this.GetPlayingAudio;
		let Matches = Array();
		for(let i of Playing){
			if(i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex){
				//We have a match; add to matches
				Matches.push(i);
				//set seek
				i.SetTrackPos(Value);
			}
		}
		//After creating match db tally up matches
		if(Matches.length == 0){
			//No Matches Found
			console.log("No matches found in SkipTo");
		}
	}
	/**
	* Stops audio associated with the object on the associated controller
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*Stop the specified controller
	//*Remove the channel from the list of playing channels
	public Stop(ClipName: String, ClipIndex: Number) {
		let PlayingChannels = this.UsedChannels;
		let PlayingAudio = this.GetPlayingItems(ClipName, ClipIndex);
		//Only stop if there are matches
		if(PlayingAudio.length > 0){
			for(let i of PlayingChannels){
				//Make sure the audio is registered to a channel and playing
				if(i.src == ClipName.toString() && i.paused != true){
					i.pause;
					//Remove the clip from the list
					this.RemovePlaying(ClipName, ClipIndex);
					//Don't forget to stop the clip on the channel
					var found = false;
					this.Channels.forEach(function(element){
						if(element.src == ClipName.toString() && found == false){
							//Just remove the first one encountered
							element.pause();
							element.currentTime = 0;
							found = true;
						}})
					console.log("stopped one audio track");
				}
			}
		}else{
			console.log("Could Not Stop audio clip because there were no matches");
		}
	}
	/**
	* Sets the specified audio clip to repeat
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	* @param {Boolean} RepeatFlag Boolean flag to set the clip to repeating
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*If we find it then set the repeating flag
	public SetRepeating(ClipName: String, ClipIndex: Number, Flag: boolean){
		let Channels = this.UsedChannels;
		let AudioOBJ = this.GetPlayingItems;

		if(this.Matches.length > 0){
				//we have a match so 
			for(let i of this.Matches){
				i.SetRepeating(Flag);
				//Search the running Channels for the first instance
				let instance = Channels.filter(Running => Running.src === ClipName)[0];
				//Set the flag
				instance.loop = Flag;	
			}

		}else{
			//No matches
			console.log("Cant Set Repeating flag: unknown clipname or index");
		}
	}
}