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
export class RadiusAudio {
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
