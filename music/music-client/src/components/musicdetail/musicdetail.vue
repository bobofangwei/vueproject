<template>
    <div class="musicdetail" v-show="isShow">
        <div class="title">音乐播放器</div>
        <div class="poster-wrapper">
            <img class="poster" :src="musics[selectedIndex].poster"></img>
        </div>
        <div class="name">{{musics[selectedIndex].name}}</div>
        <div class="artist">{{musics[selectedIndex].artist}}</div>
        <div class="control-wrapper">
            <div class="prev-wrapper" @click="prev">
                <i class="icon-previous"></i>
            </div>
            <div class="play-wrapper" @click="toggle">
                <i :class="isPlaying?'icon-pause':'icon-play'"></i>
            </div>
            <div class="next-wrapper" @click="next">
                <i class="icon-next"></i>
            </div>
        </div>
        <div class="progress" ref="progress"></div>
        <div class="time-wrapper">
            <div class="curtime">{{curtime|formatTime}}</div>
            <div class="totaltime">{{totaltime|formatTime}}</div>
        </div>
        <div id="auidio-wrapper" ref="audio-wrapper">
            <audio ref="audio" :src="musics[selectedIndex].music"></audio>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data: function() {
        return {
            isShow: false,
            isPlaying: false,
            totalTime: 0,
            curtime: 0
        };
    },
    props: {
        musics: {
            type: Array
        },
        selectedIndex: {
            type: Number
        }
    },
    methods: {
        show: function() {
            this.isShow = true;
            console.log('show');
            // 注意这里需要调用$nextTick
            this.$nextTick(function() {
                // console.log('refs', this.$refs);
                // this.audioWrapper = this.$refs['audio-wrapper'];
                // this.initAudio();
                this.progress = this.$refs['progress'];
                this.audio = this.$refs['audio'];
                // 因为可能更换歌曲，即调用audio的load事件，因此为其增添对应事件
                this.audio.addEventListener('canplay', (e) => {
                    console.log('canplay');
                    this.play();
                });
                this.audio.addEventListener('durationchange', (e) => {
                    console.log('durationchange', this.audio.duration);
                    this.totaltime = this.audio.duration;
                });
            });
        },
        next: function() {
            console.log('next');
            this.reset();
            this.selectedIndex++;
            if (this.selectedIndex > this.musics.length - 1) {
                this.selectedIndex = this.musics.length - 1;
                alert('这是最后一首音乐！');
                return;
            }
            this.audio.load();
            // 之前已经添加了对load的事件监听
        },
        prev: function() {
            console.log('prev');
            this.reset();
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = 0;
                alert('这是第一首音乐!');
                return;
            }
            this.audio.load();
        },
        pause: function() {
            console.log('pause');
            if (this.isPlaying) {
                this.isPlaying = false;
                this.audio.pause();
                this.clearTimer();
            }
        },
        play: function() {
            console.log('play');
            if (!this.isPlaying) {
                this.isPlaying = true;
                this.audio.play();
                this.startTimer();
            }
        },
        toggle: function() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        startTimer() {
            this.timerId = setInterval(() => {
                // console.log('interval', this.audio.currentTime);
                this.curtime = Math.round(this.audio.currentTime);
                this.progress.style.width = Math.round(100 * this.curtime / this.totaltime) + '%';
            }, 300);
        },
        clearTimer() {
            clearInterval(this.timerId);
            this.timerId = null;
        },
        // html5中的audio貌似不能够动态更改src
        // 更改播放歌曲的时候，需要先将原来的audio元素删除，再重新创建一个，并指定其src属性
        // initAudio: function() {
        //     if (this.audio) {
        //         this.audioWrapper.removeChild(this.audio);
        //         this.audio = null;
        //     }
        //     var audio = new Audio();
        //     audio.src = this.musics[this.selectedIndex].music;
        //     this.audioWrapper.appendChild(audio);
        //     this.audio = audio;
        // },
        // 音乐复位
        reset: function() {
            this.pause();
            this.audio.currentTime = 0;
        }
    },
    filters: {
        formatTime: function(value) {
            let ret = (Math.round(value / 60) + '').padStart(2, '0') + ':' + (Math.round(value % 60) + '').padStart(2, '0');
            console.log('ret', ret);
            return ret;
        }
    }
};
</script>
<style lang="scss">
* {
    box-sizing: border-box;
}

.musicdetail {
    background-color: #2B2B2B;
    border-radius: 20px;
    text-align: center;
    color: #fff;
    line-height: 1;
    .title {
        font-size: 30px;
        padding: 20px;
    }
    .poster-wrapper {
        .poster {
            border-radius: 10px;
            border: 5px solid #000;
            width: 65%;
            height: 65%;
        }
    }
    .name {
        margin-top: 40px;
        font-size: 35px;
        font-weight: bold;
    }
    .artist {
        margin-top: 20px;
        font-size: 25px;
    }
    .progress {
        position: fixed;
        bottom: 0;
        height: 170px;
        left: 0;
        width: 100%;
        background: linear-gradient(rgba(43,43,43,.1), rgba(0,0,255,.8));
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }
    .control-wrapper {
        position: fixed;
        bottom: 50px;
        padding: 0 20px;
        width: 100%;
        height: 100px;
        display: flex;
        font-size: 55px;
        line-height: 100px;
        .prev-wrapper {
            flex: 1;
            text-align: left;
        }
        .play-wrapper {
            text-align: center;
            border: 1px solid #fff;
            border-radius: 50%;
            width: 100px;
            height: 100px;
        }
        .next-wrapper {
            flex: 1;
            text-align: right;
        }
    }
    .time-wrapper {
        position: fixed;
        bottom: 15px;
        width: 100%;
        font-size: 14px;
        .curtime {
            float: left;
            padding: 10px 30px;
        }
        .totaltime {
            float: right;
            padding: 10px 30px;
        }
    }
}
</style>
