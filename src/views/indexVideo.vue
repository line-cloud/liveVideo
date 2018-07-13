<template>
        <div class="container">
            <div class="player">
                <div class="coverLayer" v-show="coverFloorToggle">
                      <div class="liveBegin" v-show="!liveStatus.processing">{{liveStatus.anbegin?'直播未开始':'直播已结束'}}</div>
                </div>
                <div class="liveing" v-show="liveStatus.processing">直播中</div>
                   <video-player  class="vjs-custom-skin"
                         ref="videoPlayer"
                         :options="playerOptions"
                         :playsinline="true"
                         x5-video-player-type="h5"
                         x5-video-orientation="landscape"
                         x5-video-player-fullscreen="true"
                         @play="onPlayer($event)"
                         @pause="onPlayerPause($event)"
                         @ended="onPlayerEnded($event)"
                         @playing="onPlayerPlaying($event)"
                        >
                  </video-player>
            </div>
            <div class="textMain">
                <strong class="textTitle">{{requestData.course.course_name}}</strong>
                <div style="margin-top: 0.09rem;color: #6E747A;font-size: 12px;">
                    <span>推荐指数</span>
                    <img src="../assets/image/star.png" class="textStar" v-for="item in requestData.course.class.rank_level">
                </div>
                <div style="margin-top: 0.09rem;color: #6E747A;font-size: 12px;border-bottom: 1px solid #dcdfe6;padding-bottom: 0.15rem;margin-right: 0.15rem;">开课时间 &nbsp;{{requestData.course.class.time}}</div>
                <strong style="color: #252729;font-size: 17px;margin-top: 0.15rem;display: inline-block;">老师介绍</strong>
                <div class="teacherintro">
                    <img :src="requestData.lecturer.icon_uri" alt="" class="avatarImg">
                    <div class="teacherCon">
                        <strong style="color: #252729;font-size: 14px;">{{requestData.lecturer.name}}</strong><br/>
                        <span style="color: #6E747A;font-size: 12px" v-for="item in requestData.lecturer.intro">{{item}}<br/></span>
                    </div>
                </div>
                <div  style="border-bottom: 1px solid #dcdfe6;margin-right: 0.15rem;padding-bottom: 0.15rem;">
                    <strong style="color: #252729;font-size: 17px;margin-top: 0.15rem;display: inline-block;margin-bottom: 0.17rem;">适宜人群</strong>
                    <div style="color: #6E747A;font-size: 13px;line-height:0.19rem;width: 3.38rem;">{{requestData.course.suitable_for}}</div>
                   </div>
                   <div>
                    <strong style="color: #252729;font-size: 17px;margin-top: 0.15rem;display: inline-block;margin-bottom: 0.17rem;">课程介绍</strong>
                    <div  class="courseImg">
                        <img :src="item" v-for="item in requestData.course.intro_images_uris" width="100%">
                    </div>
                   </div>
                  </div>
            </div>
          </div>
</template>
<script >
          // 设置html字体,使页面在手机端正常显示
document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px'
    import videojs from 'video.js'
    import 'videojs-contrib-hls'
    import { videoPlayer } from 'vue-video-player';
  export default {
    data () {
        return {
          localUrlData:'',
           liveStatus:{
              anbegin:false,
              processing:false,
           },
            requestData:{
              course:{
                class:''
              },
              lecturer:{

              }
            },
            coverFloorToggle:false,
          playerOptions: {
    //        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            bigPlayButton: true,
            isFullscreen:true,
            sources: [{
                // video/mp4
                // application/x-mpegURL
              type: "application/x-mpegURL",
              // http://vjs.zencdn.net/v/oceans.mp4
              src: "" //你的m3u8地址（必填）
            }],
            // http://n.sinaimg.cn/translate/20160923/WdMw-fxwevmh8824713.jpg
            poster: '', //你的封面地址
            width: document.documentElement.clientWidth,
            notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
           controlBar: {
             timeDivider: true,
             durationDisplay: true,
             remainingTimeDisplay: false,
             fullscreenToggle: false  //全屏按钮
           }
          },
          setinter:'',
        }
    },
    components: {
       videoPlayer
  },
    mounted:function() {
          this.initUrlData()
          this.getDatalist()
          this.repeatCallFun()
    },
    methods:{
        repeatCallFun:function(){
           this.setinter=setInterval(()=>{
              this.getDatalist()
           },2000)
        },
        initUrlData:function(){
            var str=window.location.href
             this.localUrlData=str.split('?')[1]
        },
        getDatalist:function(){
            this.axios.get('http://www.haoqi100.com/biz_hq/edu/live/getPseudoLiveInfo?'+this.localUrlData,{
            }).then((res)=>{
                if(res.data.statusCode==0){
                    this.requestData=res.data.returnResult
                    this.playerOptions.poster=this.requestData.course.class.live_preview_uri
                    this.playerOptions.sources[0].src=this.requestData.course.class.live_uri
 
                    if(this.requestData.course.class.live_status==1){
                             this.liveStatus.processing=true
                             this.coverFloorToggle=false
                             this.playerOptions.bigPlayButton=true
                    }else{
                             this.liveStatus.processing=false
                             this.coverFloorToggle=true
                             this.playerOptions.bigPlayButton=false
                         var date=new Date(this.requestData.course.class.time)
                         if(this.requestData.course.class.live_status==0){
                                   this.liveStatus.anbegin=true
                         }else if(this.requestData.course.class.live_status==2){
                                  var vjsposter=document.getElementsByClassName('vjs-poster')[0]
                                  vjsposter.style.display='inline-block'
                                   this.liveStatus.processing=false
                                   this.coverFloorToggle=true
                                   this.playerOptions.bigPlayButton=false
                                   this.liveStatus.anbegin=false
                                    clearInterval(this.setinter)
                         }
                    }
                    // console.log(Date.now())
                    // console.log(date.getTime())
                    // console.log(this.requestData.course.class.time)
                   
                }else{
                    this.requestData=''
                }
            })
        },
        coverDisFun:function(player){
            this.coverFloorToggle=false
        },
        onPlayer:function(){
        },
        onPlayerPlay(player) {
           // this.liveStatus.processing=false
            // var vjsposter=document.getElementsByClassName('vjs-poster')[0]
            //  vjsposter.style.display='none'
      },
     
      onPlayerPause(player) {
           // alert('player')
      },
      onPlayerEnded(player){
        var vjsposter=document.getElementsByClassName('vjs-poster')[0]
        vjsposter.style.display='inline-block'
         this.liveStatus.processing=false
         this.coverFloorToggle=true
         this.playerOptions.bigPlayButton=false
         this.liveStatus.anbegin=false
      },
      onPlayerPlaying:function(){ 
            // console.log('播放')
      },
    },
    computed: {
        player() {
          return this.$refs.videoPlayer.player
        }
  }
}
</script>
<style>
  .container{
     margin-bottom: 40px;
     margin: 0 auto;
     width: 3.75rem;
  }
    .video-js{
        width: 3.75rem;
        height: 2.1rem;
    }
    .video-js .vjs-big-play-button{
        width: 2em;
        border-radius: 1em;
  }
  .vjs-custom-skin > .video-js .vjs-big-play-button{
      margin-left: -1em;
  }
  .player{
    position: relative;
  }
  .coverLayer{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;left: 0;
    z-index: 1000
  }
  .textMain{
    margin-left: 0.15rem;
  }
  .textTitle{
    display: inline-block;
    color: #252729;
    font-size: 18px;
    margin-top: 0.16rem;
    font-weight: Medium;
  }

  .vjs-custom-skin > .video-js .vjs-progress-control.vjs-control{
        opacity: 0;
        z-index: -10;
  }
  .vjs-custom-skin > .video-js .vjs-control-bar .vjs-time-control{
      display: none;
  }
  .avatarImg{
    position: absolute;
     width: 0.81rem;
     /*height: 0.81rem;*/
     border-radius: 50%;
     top:0rem;
     left: 0;
     margin-top: 0.18rem;
  }
  .teacherintro{
     display: inline-block;
     position: relative;
     width: 3.45rem;
     border-bottom: 1px solid #dcdfe6;
     padding-bottom: 0.15rem;
  }
  .teacherCon{
     margin-left:1rem;
     margin-top: 0.15rem;
  }
  .textStar{
    width: 0.14rem;
    height: 0.14rem;
    position: relative;
    top: 0.02rem;
    margin-left: 0.01rem;
  }
  .liveBegin{
      width: 1.02rem;
      height: 0.35rem;
      background-color: #FF7019;
      color:#fff;
      text-align: center;
      line-height: 0.35rem;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 5px;
      /*-webkit-transform: translate(-50%,-50%);*/
      margin-top: -1em !important;
      margin-left: -3.5em;
  }
  .courseImg{
     width: 3.38rem;
  }

  .liveing{
     width: 0.45rem;
     height: 0.2rem;
     border-radius: 3px;
     background-color: #FF7019; 
     color:#fff;
      text-align: center;
      line-height: 0.2rem;
     font-size: 12px;
     position: absolute;
     right: 0.35rem;
     top: 0.17rem;
     z-index: 1000;
  }
  .video-js:hover .vjs-big-play-button, .vjs-custom-skin > .video-js .vjs-big-play-button:focus, .vjs-custom-skin > .video-js .vjs-big-play-button:active{
      background-color:rgba(0,0,0,0.45);
  }
  @media screen and (min-width: 800px) {
    .container{
       width: 375px;
   }
    .video-js{
        width: 375px;;
        height: 210px;
    }
  .textMain{
    margin-left: 15px;
  }
  .textTitle{
    margin-top: 16px;
  }
   .teacherCon{
     margin-left:100px;
     margin-top: 15px;
  }
  .avatarImg{
     width: 81px;
     margin-top: 18px;
  }
  .textStar{
    width:14px;
    height: 14px;
    top: 2px;
    margin-left: 1px
  }
  .liveBegin{
      width: 102px;
      height: 35px;
      line-height:  35px;
      border-radius: 5px;
  }
   .teacherintro{
     width:345px;
  }
  .liveing{
     width: 45px;
     height: 20px;
      line-height: 20px;
     right: 35px;
     top: 17px;
  }

  .courseImg{
     width: 338px;
     }
  }
</style>