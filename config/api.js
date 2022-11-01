var MeedogServerApi = 'https://XXXXXX/user/';
var MeedogSearchApi = 'https://XXXXXX/search/';
var MeedogDatingApi = 'https://XXXXXX/dating/';

module.exports = {

    GetDatingLikeUrl: MeedogServerApi + 'activity/like',
    GetActivityShareUrl: MeedogServerApi + 'activity/share',
    GetActivityCommentUrl: MeedogServerApi + 'activity/comment',
    GetUserWeiboUrl: MeedogServerApi + 'activity/weibo',
    GetTokenUrl: MeedogServerApi + 'activity/user',
    AddDatingUrl: MeedogServerApi + 'activity/add',
    InsertCommentUrl: MeedogServerApi + 'activity/add_comment',

    GetWeiboLikeUrl: MeedogServerApi + 'msg/like',
    GetWeiboShareUrl: MeedogServerApi + 'msg/share',
    GetWeiboCommentUrl: MeedogServerApi + 'msg/comment',
    GetUserWeiboUrl: MeedogServerApi + 'msg/weibo',
    GetTokenUrl: MeedogServerApi + 'token/user',
    InsertUserWeiboUrl: MeedogServerApi + 'msg/add',
    InsertCommentUrl: MeedogServerApi + 'msg/add_comment',

    UploadImageUrl: MeedogServerApi + 'image/upload',
    DownloadImageUrl: MeedogServerApi + 'image/get',
    SearchUserUrl: MeedogSearchApi + 'esUser/search/simple', //搜索结果
    SearchEduUrl: MeedogSearchApi + 'esEdu/search/simple', //搜索结果
    SearchAssetUrl: MeedogSearchApi + 'esAsset/search/simple', //搜索结果
    SearchIndexUrl: MeedogSearchApi + 'esUser/search', //搜索结果

    //wechat related
    GetAllCityUrl: MeedogServerApi + 'init/all_city',
    GetSexualTypeUrl: MeedogServerApi + 'init/sexual_type',
    GetGenderUrl: MeedogServerApi + 'init/gender',
    GlobalInitUrl: MeedogServerApi + 'init/info',
    GetDegreeUrl: MeedogServerApi + 'init/degree',
    GetRegionUrl: MeedogServerApi + 'init/region',
    GetCityUrl: MeedogServerApi + 'init/city',
    GetZodiacUrl: MeedogServerApi + 'init/zodiac',
    GetConstellationUrl: MeedogServerApi + 'init/constellation',
    GetProvinceUrl: MeedogServerApi + 'init/province',
    GetDistrictUrl: MeedogServerApi + 'init/district',
    GetHouseholdsUrl: MeedogServerApi + 'init/households',
    GetCollegeStatusUrl: MeedogServerApi + 'init/college_status',
    GetMarriageUrl: MeedogServerApi + 'init/marriage',

    WechatLoginUrl: MeedogServerApi + 'wx/login_by_weixin',
    RegisterUrl: MeedogServerApi + 'sso/register',
    LoginUrl: MeedogServerApi + 'sso/login',
    InfoUrl: MeedogServerApi + 'sso/info',
    UpdateUrl: MeedogServerApi + 'sso/update',
    GetAuthCodeUrl: MeedogServerApi + 'sso/getAuthCode',
    GetInvitationsUrl: MeedogServerApi + 'sso/getInvitations',
    GetInvitationCodeUrl: MeedogServerApi + 'sso/getInvitationCode',
    UpdatePasswordUrl: MeedogServerApi + 'sso/updatePassword',
    RefreshTokenUrl: MeedogServerApi + 'sso/refreshToken',

    HomeContentUrl: MeedogServerApi + 'home/content',
    HomeRecommendUrl: MeedogServerApi + 'home/recommend',
    HomeHotActivityUrl: MeedogServerApi + 'home/hotActivity',
    HomeNewUserUrl: MeedogServerApi + 'home/newUser',
    HomeTotalUrl: MeedogServerApi + 'home/total',
    HomeAdUrl: MeedogServerApi + 'home/ad',

    EduListUrl: MeedogServerApi + 'edu/list',
    EduInsertUrl: MeedogServerApi + 'edu/insert',
    EduGetIdUrl: MeedogServerApi + 'edu/get_id',
    EduDetailUrl: MeedogServerApi + 'edu/detail',
    EduUpdateUrl: MeedogServerApi + 'edu/update',
    EduClearUrl: MeedogServerApi + 'edu/clear',
    EduDeleteUrl: MeedogServerApi + 'edu/delete',
    EduPicInsertUrl: MeedogServerApi + 'edu/pic_insert',

    BasicListUrl: MeedogServerApi + 'basic/list',
    BasicInsertUrl: MeedogServerApi + 'basic/insert',
    BasicDetailUrl: MeedogServerApi + 'basic/detail',
    BasicUpdateUrl: MeedogServerApi + 'basic/update',
    BasicClearUrl: MeedogServerApi + 'basic/clear',
    BasicDeleteUrl: MeedogServerApi + 'basic/delete',
    BasicPicInsertUrl: MeedogServerApi + 'basic/pic_insert',

    AssetBenchmarkListUrl: MeedogServerApi + 'benchmark/list',
    AssetBenchmarkDetailUrl: MeedogServerApi + 'benchmark/detail',

    AssetListUrl: MeedogServerApi + 'asset/list',
    AssetInsertUrl: MeedogServerApi + 'asset/insert',
    AssetDetailUrl: MeedogServerApi + 'asset/detail',
    AssetUpdateUrl: MeedogServerApi + 'asset/update',
    AssetClearUrl: MeedogServerApi + 'asset/clear',
    AssetDeleteUrl: MeedogServerApi + 'asset/delete',

    MusicInsertUrl: MeedogServerApi + 'music/update',
    MusicDetailUrl: MeedogServerApi + 'music/clear',
    MusicListUrl: MeedogServerApi + 'music/delete',
    MusicUpdateUrl: MeedogServerApi + 'music/update',
    MusicClearUrl: MeedogServerApi + 'music/clear',
    MusicDeleteUrl: MeedogServerApi + 'music/delete',

    MovieInsertUrl: MeedogServerApi + 'movie/update',
    MovieDetailUrl: MeedogServerApi + 'movie/clear',
    MovieListUrl: MeedogServerApi + 'movie/delete',
    MovieUpdateUrl: MeedogServerApi + 'movie/update',
    MovieClearUrl: MeedogServerApi + 'movie/clear',
    MovieDeleteUrl: MeedogServerApi + 'movie/delete',

    BookInsertUrl: MeedogServerApi + 'book/update',
    BookDetailUrl: MeedogServerApi + 'book/clear',
    BookListUrl: MeedogServerApi + 'book/delete',
    BookUpdateUrl: MeedogServerApi + 'book/update',
    BookClearUrl: MeedogServerApi + 'book/clear',
    BookDeleteUrl: MeedogServerApi + 'book/delete',

    FoodInsertUrl: MeedogServerApi + 'food/update',
    FoodDetailUrl: MeedogServerApi + 'food/clear',
    FoodListUrl: MeedogServerApi + 'food/delete',
    FoodUpdateUrl: MeedogServerApi + 'food/update',
    FoodClearUrl: MeedogServerApi + 'food/clear',
    FoodDeleteUrl: MeedogServerApi + 'food/delete',

    TravellInsertUrl: MeedogServerApi + 'travell/update',
    TravellDetailUrl: MeedogServerApi + 'travell/clear',
    TravellListUrl: MeedogServerApi + 'travell/delete',
    TravellUpdateUrl: MeedogServerApi + 'travell/update',
    TravellClearUrl: MeedogServerApi + 'travell/clear',
    TravellDeleteUrl: MeedogServerApi + 'travell/delete',

    CharactorInsertUrl: MeedogServerApi + 'charactor/update',
    CharactorDetailUrl: MeedogServerApi + 'charactor/clear',
    CharactorListUrl: MeedogServerApi + 'charactor/delete',
    CharactorUpdateUrl: MeedogServerApi + 'charactor/update',
    CharactorClearUrl: MeedogServerApi + 'charactor/clear',
    CharactorDeleteUrl: MeedogServerApi + 'charactor/delete',

    LoveStandardInsertUrl: MeedogServerApi + 'love_standard/update',
    LoveStandardDetailUrl: MeedogServerApi + 'love_standard/clear',
    LoveStandardListUrl: MeedogServerApi + 'love_standard/delete',
    LoveStandardUpdateUrl: MeedogServerApi + 'love_standard/update',
    LoveStandardClearUrl: MeedogServerApi + 'love_standard/clear',
    LoveStandardDeleteUrl: MeedogServerApi + 'love_standard/delete',

    SelfInsertUrl: MeedogServerApi + 'self/update',
    SelfDetailUrl: MeedogServerApi + 'self/clear',
    SelfListUrl: MeedogServerApi + 'self/delete',
    SelfUpdateUrl: MeedogServerApi + 'self/update',
    SelfClearUrl: MeedogServerApi + 'self/clear',
    SelfDeleteUrl: MeedogServerApi + 'self/delete',

    IdealValueInsertUrl: MeedogServerApi + 'ideal_value/update',
    IdealValueDetailUrl: MeedogServerApi + 'ideal_value/clear',
    IdealValueListUrl: MeedogServerApi + 'ideal_value/delete',
    IdealValueUpdateUrl: MeedogServerApi + 'ideal_value/update',
    IdealValueClearUrl: MeedogServerApi + 'ideal_value/clear',
    IdealValueDeleteUrl: MeedogServerApi + 'ideal_value/delete',
}