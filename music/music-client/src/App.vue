<template>
    <div id="app" class="musics">
        <ul>
            <li v-for="(item,index) in musics" class="music-list" @click="selectMusic(index)">
                <p class="music-item">{{item.name}}</p>
            </li>
        </ul>
        <musicdetail ref="musicdetail" :musics="musics" :selectedIndex="selectedIndex" class="musicdetail" v-show="selectedIndex>=0"></musicdetail>
    </div>
</template>
<script>
import musicdetail from './components/musicdetail/musicdetail';
export default {
    name: 'app',
    data: function() {
        return {
            musics: [],
            selectedIndex: -1
        };
    },
    created: function() {
        this.$http.get('/api/music').then(response => {
            this.musics = response.body;
            // console.log('musics', this.musics);
        });
    },
    methods: {
        selectMusic: function(index) {
            this.selectedIndex = index;
            this.$refs.musicdetail.show();
        }
    },
    components: {
        musicdetail
    }
}
</script>
<style lang="scss" scope>
.music-list {
    margin: 0;
    list-style: none;
    font-size: 28px;
    padding: 5px 15px;
    border-bottom: 1px solid #ccc;
}

.musicdetail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
}
</style>
