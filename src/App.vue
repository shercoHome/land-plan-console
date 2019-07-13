<template>
  <div id="app">
    <el-dialog
      :visible="true"
      v-if="loginForm.visible"
      :fullscreen="true"
      center
      :show-close="false"
    >
      <div slot="title" class="dialog-footer">
        <h1>达诚计划后台管理系统</h1>
      </div>

      <el-form
        :model="loginForm"
        style="width:80%;margin:0 auto"
        :label-width="loginForm.labelWidth"
      >
        <el-form-item label="账号">
          <el-input v-model="loginForm.name" required autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" required v-model="loginForm.psw" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fn_alert('请联系管理员')">忘记密码</el-button>
        <el-button type="primary" @click="__login">确定登录</el-button>

        <p style="font-size:14px">。</p>
      </div>
    </el-dialog>

    <!-- 修改密码 -->

    <el-dialog title="修改密码" :visible.sync="changePSW.visible" center>
      <el-form :model="changePSW" style="width:50%;margin:0 auto">
        <el-form-item label="旧密码">
          <el-input type="password" required v-model="changePSW.oldPSW" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" required v-model="changePSW.newPSW" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input type="password" required v-model="changePSW.reNewPSW" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePSW.visible = false">取 消</el-button>
        <el-button type="primary" @click="fn_change_psw">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 小弹窗 editor -->

    <el-dialog
      :title="myEditor.title"
      :visible="true"
      :show-close="false"
      v-if="myEditor.visible"
      width="60%"
      append-to-body
    >
      <tinymce-editor ref="editor" v-model="myEditor.content" @onClick="fn_editor_click"></tinymce-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fn_editor_close">取 消</el-button>
        <el-button @click="fn_editor_clear">清空内容</el-button>
        <el-button type="primary" @click="fn_myEditor_yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 小弹窗 用于多行修改 -->
    <MulForm
      :prop_dynamicValidateForm="dynamicValidateForm"
      @child-event-fn-dynamicValidateForm-dynamicInputs="fn_get_dynamicValidateForm"
      @child-event-fn-dynamicValidateForm-hide="dynamicValidateForm.visible=false"
    />
    <!-- 大弹窗 显示单独的json资料-->
    <el-dialog :title="diaTable.title" :visible.sync="diaTable.visible" width="80%">
      <el-table :data="diaTable.data">
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column property="keyCN" label="项目" width="300"></el-table-column>
        <!-- $writeType[表][key]决定 设置的表现类型：多行，单行input或select，或者直接为空 -->
        <el-table-column property="value" label="设置">
          <template slot-scope="prop">
            <template v-if="$writeType[prop.row.ele][prop.row.key]=='select'">
              <el-select
                :disabled="prop.row.switchLimit.myLimitValue!='1'"
                @change="fn_diaTable_update_select($event,prop.row)"
                v-model="prop.row.value"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in $writeType[prop.row.ele][prop.row.key+'_options']"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="$writeType[prop.row.ele][prop.row.key]=='multiline'">
              <span class="nowrap">
                <el-button
                  v-show="prop.row.switchLimit.myLimitValue == 1"
                  @click="fn_diaTable_update_multiline(prop.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                ></el-button>
                {{prop.row.value}}
              </span>
            </template>
            <template v-else-if="$writeType[prop.row.ele][prop.row.key]=='input'">
              <span class="nowrap">
                <el-button
                  v-show="prop.row.switchLimit.myLimitValue == 1"
                  @click="fn_diaTable_update_input(prop.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                ></el-button>
                {{prop.row.value}}
              </span>
            </template>
            <template v-else-if="$writeType[prop.row.ele][prop.row.key]=='editor'">
              <span class="nowrap">
                <el-button
                  v-show="prop.row.switchLimit.myLimitValue == 1"
                  @click="fn_diaTable_update_editor(prop.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                ></el-button>
                {{prop.row.value}}
              </span>
            </template>
            <template v-else>{{prop.row.value}}</template>
          </template>
        </el-table-column>
        <!-- 登录者的权限，决定是显示【修改/授权】switchLimit.myLimitValue -->
        <!-- 登录者的网页设置、以及会员资料，  显示【修改】 -->
        <!-- 线下会员的网页设置、 显示【授权】的形关 -->
        <el-table-column
          v-if="diaTable.data[0].userID==userInfo.id || diaTable.data[0].ele=='user'"
          property="switchLimit"
          label="修改"
        >
          <i slot-scope="prop" v-if="prop.row.switchLimit.myLimitValue=='1'" class="el-icon-check"></i>
        </el-table-column>
        <el-table-column v-else property="switchLimit" label="授权">
          <template slot-scope="prop" v-if="prop.row.switchLimit.myLimitValue=='1'">
            <el-tooltip
              :content="prop.row.switchLimit.userLimitValue=='1'?'已授权站长（可修改此项）':'未授权站长（不能自行更改）'"
              placement="top"
            >
              <el-switch
                v-model="prop.row.switchLimit.userLimitValue"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                @change="switchChang($event,prop.row)"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 大弹窗 显示arrayTable-->
    <el-dialog :title="arrayTable.title" :visible.sync="arrayTable.visible" width="80%">
      <el-table :data="arrayTable.data">
        <el-table-column type="index" :index="1"></el-table-column>
        <template v-for="(value, keyName) in arrayTable.data[0]">
          <el-table-column
            :property="keyName"
            :label="$chinese[arrayTable.name][keyName]"
            width="300"
            :key="keyName"
            v-if="arrayTable.noShowkey.indexOf(keyName)==-1"
          ></el-table-column>
        </template>
      </el-table>
    </el-dialog>
    <!-- 正式的内容，选项卡 -->
    <el-tabs type="border-card" tab-position="left" @tab-click="fn_tab_click">
      <!-- 第一个选项，欢迎语 -->
      <el-tab-pane label="欢迎回来" class="bulletin">
        <el-button v-if="isAdmin" @click="fn_bulletin_to_editor" icon="el-icon-edit">修改公告</el-button>
        <el-button @click="changePSW.visible=true" icon="el-icon-setting">修改密码</el-button>
        <el-button @click="__loginOut" type="danger" icon="el-icon-guide">安全退出</el-button>
        <el-divider></el-divider>
        <div v-html="bulletin" :style="{height:fullHeight-50+'px',overflow:'scroll'}"></div>
        <!-- <iframe src="https://www.biqugetv.com/1_1721/" style="width:100%"></iframe> -->
      </el-tab-pane>
      <!-- 第二个选项，代理网站 -->
      <el-tab-pane label="代理网站">
        <template>
          <el-row :gutter="10">
            <el-col :xs="22" :sm="9" :md="8" :lg="8" :xl="8">
              <el-autocomplete
                class="inline-input"
                v-model="tempValueForSearch"
                :fetch-suggestions="querySearch"
                placeholder="account 或 www.xx.com"
              >
                <!-- <el-input
                placeholder="account 或 www.xx.com"
                v-model="tempValueForSearch"
                class="input-with-select"
                >-->

                <el-select
                  v-model="sortSelectPicked"
                  slot="append"
                  placeholder="请选择"
                  class="select-short"
                  style="margin-right:.5em"
                >
                  <el-option-group>
                    <el-option label="网站创建倒序" value="1"></el-option>
                    <el-option label="网站创建顺序" value="2"></el-option>
                    <el-option v-if="isAdmin" label="角色倒序" value="3"></el-option>
                    <el-option v-if="isAdmin" label="角色顺序" value="4"></el-option>
                    <el-option label="网址倒序" value="5"></el-option>
                    <el-option label="网址顺序" value="6"></el-option>
                  </el-option-group>
                </el-select>

                <el-button
                  @click="loadPage=1;fn_get_web_set_by_id()"
                  slot="append"
                  icon="el-icon-search"
                >搜索</el-button>
              </el-autocomplete>
            </el-col>

            <el-col :xs="22" :sm="9" :md="6" :lg="6" :xl="4">
              每次加载：
              <el-input-number
                v-model="loadLimit"
                :step="10"
                controls-position="right"
                :min="20"
                size="mini"
              ></el-input-number>条
            </el-col>

            <el-col :xs="22" :sm="4" :md="3" :lg="3" :xl="2">
              <el-button
                @click="tempValueForSearch='';loadPage=1;fn_get_web_set_by_id()"
                type="primary"
              >刷新列表</el-button>
            </el-col>
          </el-row>

          <el-table
            :data="myWebSet"
            style="width: 100%"
            :height="fullHeight"
            v-loadmore="fn_load_myWebSet"
          >
            <el-table-column type="index" :index="1" sortable></el-table-column>
            <el-table-column prop="userName" label="站长(代理)账号" sortable width="140"></el-table-column>
            <el-table-column prop="userLevel" label="角色" sortable width="80">
              <template
                slot-scope="prop"
              >{{$writeType['user']['userLevel_options'][prop.row.userLevel-1].label}}</template>
            </el-table-column>
            <el-table-column
              v-if="isAdmin"
              prop="userID"
              label="代理ID"
              sortable
              width="90"
              :sort-method="sortMethodUserID"
              :key="Math.random()"
            >
              <template slot-scope="prop">{{prop.row.userID}}</template>
            </el-table-column>
            <el-table-column v-if="isAdmin" prop="agentName" label="归属代理" width="100" sortable :key="Math.random()"></el-table-column>
            <el-table-column prop="siteLink" sortable label="专属网址">
              <template slot-scope="prop">
                <span class="nowrap">
                  <el-button
                    @click="fn_show_myWebSet(prop.row)"
                    type="primary"
                    icon="el-icon-thumb"
                    size="mini"
                    circle
                  ></el-button>
                  {{prop.row.siteLink}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="网站ID" sortable width="90" v-if="isAdmin"></el-table-column>
            <el-table-column prop="siteConfig" label="网站名称" sortable>
               <template slot-scope="prop">
                 {{prop.row.siteConfig.split('||')[0].split('|')[0]}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <!-- 第三个选项，计划授权 authorizeList -->
      <el-tab-pane label="计划授权">
        <template>
          <el-row :gutter="10">
            <!-- <el-col :xs="8" :sm="8" :md="6" :lg="4" :xl="4">
              <el-input placeholder="请填写账号" v-model="tempValueForSearch" class="input-with-select">
                <el-button @click="fn_get_my_authorize_list" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>-->

            <el-col :xs="22" :sm="9" :md="8" :lg="8" :xl="8">
              <el-autocomplete
                class="inline-input"
                v-model="tempValueForSearch"
                :fetch-suggestions="querySearch"
                placeholder="请填写账号"
              >
                <!-- <el-input placeholder="请填写账号" v-model="tempValueForSearch" class="input-with-select"> -->
                <el-select
                  v-model="authorizeSelectPicked"
                  slot="prepend"
                  placeholder="请选择"
                  class="select-short"
                  :disabled="loginUserLimit.user_authorizationStatus!='1'"
                >
                  <el-option-group>
                    <el-option label="搜索信息功能" value="search"></el-option>
                  </el-option-group>
                  <el-option-group>
                    <el-option label="添加荣誉授权" value="1"></el-option>
                    <el-option label="永久禁止授权" value="2"></el-option>
                  </el-option-group>
                  <el-option-group label="不授权+不禁止">
                    <el-option label="移除授权状态" value="0"></el-option>
                  </el-option-group>
                </el-select>

                <el-select
                  v-model="sortSelectPicked"
                  slot="append"
                  placeholder="请选择"
                  class="select-short"
                  style="margin-right:.5em"
                >
                  <el-option-group>
                    <el-option label="登录倒序" value="1"></el-option>
                    <el-option label="登录顺序" value="2"></el-option>
                    <el-option label="注册倒序" value="3"></el-option>
                    <el-option label="注册顺序" value="4"></el-option>
                    <el-option label="授权倒序" value="5"></el-option>
                    <el-option label="授权顺序" value="6"></el-option>
                  </el-option-group>
                </el-select>

                <el-button
                  v-if="authorizeSelectPicked=='search'"
                  slot="append"
                  @click="loadPage=1;fn_get_my_authorize_list()"
                  icon="el-icon-search"
                >搜索</el-button>
                <el-button
                  v-else
                  slot="append"
                  @click="fn_authorize_list_add"
                  icon="el-icon-s-promotion"
                >执行</el-button>
              </el-autocomplete>
            </el-col>

            <el-col :xs="22" :sm="9" :md="6" :lg="6" :xl="4">
              每次加载：
              <el-tooltip :content="'分享授权和荣誉授权分别计算条数，总计最多'+loadLimit*2+'条'" placement="top">
                <el-input-number
                  v-model="loadLimit"
                  :step="10"
                  controls-position="right"
                  :min="20"
                  size="mini"
                ></el-input-number>
              </el-tooltip>条
            </el-col>

            <el-col :xs="22" :sm="4" :md="3" :lg="3" :xl="2">
              <el-button
                @click="authorizeSelectPicked='search';tempValueForSearch='';loadPage=1;fn_get_my_authorize_list()"
                type="primary"
              >刷新列表</el-button>
            </el-col>
          </el-row>
          <!-- /////////////////////////////////////// -->
          <el-table
            :data="authorizeList"
            style="width: 100%;"
            :height="fullHeight"
            v-loadmore="fn_load_myAuthorizeList"
          >
            <!--             :default-sort="{prop: 'updateTime', order: 'descending'}" -->
            <el-table-column type="index" :index="1"></el-table-column>
            <el-table-column prop="userName" label="账号" sortable width="140"></el-table-column>
            <el-table-column
              prop="userID"
              label="账号ID"
              sortable
              :sort-method="sortMethodUserID"
              width="90"
              v-if="isAdmin"
            ></el-table-column>
            <el-table-column
              prop="wbStatus"
              label="状态"
              sortable
              column-key="wbStatus"
              :filters="[{text: '特别授权', value: '1'}, {text: '禁止授权', value: '2'}, {text: '分享授权', value: '3'}]"
              :filter-method="filterHandler"
            >
              <template slot-scope="prop">
                <el-select
                  v-model="prop.row.wbStatus"
                  placeholder="请选择"
                  @change="fn_authorizeList_wbStatus_select($event,prop.row)"
                  class="select-short"
                  :disabled="loginUserLimit.user_authorizationStatus!='1'"
                >
                  <el-option label="荣誉授权" value="1"></el-option>
                  <el-option label="永不授权" value="2"></el-option>
                  <el-option label="移除以上状态" value="0" v-if="prop.row.wbStatus!=3"></el-option>
                  <el-option label="分享授权" value="3" :disabled="true"></el-option>
                </el-select>
                <el-button
                  v-if="prop.row.wbStatus=='3'"
                  @click="fn_get_share_ip_list_by_code(prop.row.id)"
                  icon="el-icon-s-operation"
                  type="primary"
                  size="mini"
                  circle
                  class="ml"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" sortable label="授权时间"></el-table-column>
            <el-table-column prop="loginTime" sortable label="最后登录"></el-table-column>
            <el-table-column prop="updateIP" sortable label="IP"></el-table-column>
            <!-- <el-table-column prop="siteLink" sortable label="专属网址"></el-table-column> -->
          </el-table>
          <!-- /////////////////////////////////////// -->
        </template>
      </el-tab-pane>

      <!-- 第四个选项，会员信息 myuser -->
      <el-tab-pane label="会员信息">
        <template>
          <el-row :gutter="10">
            <el-col :xs="22" :sm="9" :md="8" :lg="8" :xl="8">
              <el-autocomplete
                class="inline-input el-autocomplete-short"
                v-model="tempValueForSearch"
                :fetch-suggestions="querySearch"
                placeholder="请填写账号"
              >
                <el-select
                  v-model="myUserSelectPicked"
                  slot="prepend"
                  placeholder="请选择"
                  class="select-short"
                >
                  <el-option-group>
                    <el-option label="代理线下" value="search"></el-option>
                    <el-option label="会员资料" value="0"></el-option>
                  </el-option-group>
                </el-select>

                <el-select
                  v-model="sortSelectPicked"
                  slot="append"
                  placeholder="请选择"
                  class="select-short"
                  style="margin-right:.5em"
                >
                  <el-option-group>
                    <el-option label="登录倒序" value="1"></el-option>
                    <el-option label="登录顺序" value="2"></el-option>
                    <el-option label="注册倒序" value="3"></el-option>
                    <el-option label="注册顺序" value="4"></el-option>
                    <el-option label="授权倒序" value="5"></el-option>
                    <el-option label="授权顺序" value="6"></el-option>
                  </el-option-group>
                </el-select>

                <el-button
                  v-if="myUserSelectPicked=='search'"
                  slot="append"
                  @click="loadPage=1;fn_get_my_userList()"
                  icon="el-icon-search"
                >搜索</el-button>
                <el-button
                  v-else
                  slot="append"
                  @click="fn_show_user_by_name()"
                  icon="el-icon-search"
                >搜索</el-button>
              </el-autocomplete>
            </el-col>

            <el-col :xs="22" :sm="9" :md="6" :lg="6" :xl="4">
              每次加载
              <el-input-number
                v-model="loadLimit"
                :step="10"
                controls-position="right"
                :min="20"
                size="mini"
              ></el-input-number>条
            </el-col>

            <el-col :xs="22" :sm="4" :md="3" :lg="3" :xl="2">
              <el-button
                @click="myUserSelectPicked='search';tempValueForSearch='';loadPage=1;fn_get_my_userList()"
                type="primary"
              >刷新列表</el-button>
            </el-col>
          </el-row>

          <el-table
            :data="myUser"
            style="width: 100%"
            :height="fullHeight"
            v-loadmore="fn_load_myUser"
          >
            <!-- :default-sort="{prop: 'registerTime', order: 'descending'}" -->
            <!-- , order: 'descending' -->
            <el-table-column type="index" :index="1" sortable></el-table-column>
            <el-table-column prop="userName" label="账号" sortable>
              <template slot-scope="prop">
                <el-button
                  @click="fn_show_user_by_name(prop.row.userName)"
                  type="primary"
                  icon="el-icon-thumb"
                  size="mini"
                  circle
                ></el-button>
                {{prop.row.userName}}
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="ID"
              sortable
              width="60"
              :sort-method="sortMethod"
              v-if="isAdmin"
              :key="Math.random()"
            ></el-table-column>


            <el-table-column prop="registerTime" label="注册时间" width="150" sortable></el-table-column>
            <el-table-column prop="registerIP" label="注册IP" width="125" sortable></el-table-column>
            <el-table-column prop="shareCode" label="分享" width="100" sortable :sort-method="sortMethodShareIPCount">
              <template slot-scope="prop">
                <el-badge
                  v-if="prop.row.shareIPCount && prop.row.shareIPCount>0"
                  :value="prop.row.shareIPCount"
                  type="primary"
                  class="badgeitem"
                >
                  <el-button
                    @click="fn_get_share_ip_list_by_code(prop.row.shareCode)"
                    size="mini"
                    round
                  >查看</el-button>
                </el-badge>
                <el-badge v-else :value="prop.row.shareIPCount" type="info" class="badgeitem">
                    <el-button @click="fn_alert('暂无分享数据')" size="mini">查看</el-button>
                  </el-badge>
              </template>
            </el-table-column>
            <el-table-column prop="userLevel" label="角色" width="80" sortable>
              <template
                slot-scope="prop"
              >{{ fn_get_selet_option_json('user','userLevel')[prop.row.userLevel]}}</template>
            </el-table-column>
            <el-table-column v-if="isAdmin" prop="agentName" label="归属代理" width="80" sortable></el-table-column>
            <el-table-column
              prop="agentStatus"
              label="代理"
              sortable
              :sort-method="sortMethodNextCount"
              width="100"
            >
              <!-- agentStatus nextCount nextCanShow -->
              <template slot-scope="prop">
                <template v-if="prop.row.agentStatus=='1'">
                  <el-badge
                    v-if="prop.row.nextCanShow && prop.row.nextCount>0"
                    :value="prop.row.nextCount"
                    type="primary"
                    class="badgeitem"
                  >
                    <el-button
                      @click="tempValueForSearch=prop.row.userName;loadPage=1;fn_get_my_userList()"
                      size="mini"
                    >线下</el-button>
                  </el-badge>
                  <el-badge v-else :value="prop.row.nextCount" type="info" class="badgeitem">
                    <el-button @click="fn_alert('暂无线下会员')" size="mini">线下</el-button>
                  </el-badge>
                </template>
                <template v-else-if="prop.row.agentStatus=='0'">会员</template>
                <template v-else>待审</template>
              </template>
            </el-table-column>
            <el-table-column prop="userActive" label="状态" width="80" sortable>
              <template
                slot-scope="prop"
              >{{ fn_get_selet_option_json('user','userActive')[prop.row.userActive]}}</template>
            </el-table-column>
            <el-table-column prop="loginTime" label="最后登录" width="150" sortable></el-table-column>
          </el-table>
        </template>
      </el-tab-pane>

      <!-- 第五个选项， 代理归属 myuser -->

      <el-tab-pane label="代理归属">
        <template>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6" v-if="loginUserLimit.user_agentAdmin==1">
              <el-form ref="form" label-width="80px">
                <el-form-item>
                  <h3>会员转移到其它代理</h3>
                </el-form-item>
                <el-form-item label="用户账号">
                  <el-autocomplete
                    required
                    v-model="tempValueForSearch"
                    :fetch-suggestions="querySearch"
                    placeholder="请填写账号"
                  ></el-autocomplete>
                </el-form-item>

                <el-form-item label="选择操作">
                  <el-select value="1" placeholder="会员转移" required>
                    <el-option label="会员转移" value="1"></el-option>
                  </el-select>
                </el-form-item>

                <!-- <el-form-item label="选择操作">
                  <el-select v-model="creatSelectPicked" placeholder="请选择" required>
                    <el-option label="创建会员" value="3" v-if="loginUserLimit.create_user_3!=='0'"></el-option>
                    <el-option label="会员晋升代理" value="2" v-if="loginUserLimit.create_user_2!=='0'"></el-option>
                    <el-option label="代理晋升站长" value="1" v-if="loginUserLimit.create_user_1!=='0'"></el-option>
                  </el-select>
                </el-form-item>-->

                <el-form-item label="归属代理">
                  <el-input v-model="changUserTo" required></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="fn_change_agent">确认转移</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col
              :span="6"
              v-if="loginUserLimit.create_user_3!=='0' || loginUserLimit.create_user_2!=='0' || loginUserLimit.create_user_1!=='0'"
            >
              <el-form ref="form" label-width="80px">
                <el-form-item>
                  <h3>创建{{(loginUserLimit.create_user_2!=='0'||loginUserLimit.create_user_1!=='0')?'/晋升':""}}账号</h3>
                </el-form-item>
                <el-form-item label="用户账号">
                  <el-autocomplete
                    required
                    v-model="tempValueForSearch"
                    :fetch-suggestions="querySearch"
                    placeholder="请填写账号"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="选择操作">
                  <el-select v-model="creatSelectPicked" placeholder="请选择" required>
                    <el-option label="创建会员" value="3" v-if="loginUserLimit.create_user_3!=='0'"></el-option>
                    <el-option label="会员晋升代理" value="2" v-if="loginUserLimit.create_user_2!=='0'"></el-option>
                    <el-option label="代理晋升站长" value="1" v-if="loginUserLimit.create_user_1!=='0'"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="归属代理">
                  <el-input v-model="addUserFrom" required :disabled="userInfo.userLevel!='1'"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="fn_create_one_user">立即执行</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

          <!-- /////////////////////////////////////// -->
        </template>
      </el-tab-pane>
      <!-- 第六个选项， 计划设置 planList -->
      <el-tab-pane label="计划设置" v-if="isAdmin">
        <template>
          <el-row :gutter="10">
            <el-col :xs="22" :sm="9" :md="8" :lg="8" :xl="8">
              <el-autocomplete
                class="inline-input"
                v-model="tempValueForSearch"
                :fetch-suggestions="querySearch"
                placeholder="account 或 www.xx.com"
              >
                <el-select
                  v-model="planSelectPicked"
                  slot="prepend"
                  placeholder="请选择"
                  class="select-short"
                >
                  <el-option label="搜索计划" value="search"></el-option>
                  <el-option label="新增计划" value="create"></el-option>
                </el-select>

                <el-select
                  v-model="sortSelectPicked"
                  slot="append"
                  placeholder="请选择"
                  class="select-short"
                  style="margin-right:.5em"
                >
                  <el-option-group>
                    <el-option label="创建倒序" value="1"></el-option>
                    <el-option label="创建顺序" value="2"></el-option>
                    <el-option label="显示倒序" value="3"></el-option>
                    <el-option label="显示顺序" value="4"></el-option>
                    <el-option label="可用倒序" value="5"></el-option>
                    <el-option label="可用顺序" value="6"></el-option>
                  </el-option-group>
                </el-select>

                <el-button
                  v-if="planSelectPicked=='search'"
                  slot="append"
                  @click="loadPage=1;fn_get_lottery_api_by_id()"
                  icon="el-icon-search"
                ></el-button>
                <el-button
                  v-else-if="planSelectPicked=='create'"
                  slot="append"
                  @click="fn_get_lottery_api_by_id('create')"
                  icon="el-icon-circle-plus-outline"
                ></el-button>
              </el-autocomplete>
            </el-col>

            <el-col :xs="22" :sm="9" :md="6" :lg="6" :xl="4">
              每次加载：
              <el-input-number
                v-model="loadLimit"
                :step="10"
                controls-position="right"
                :min="20"
                size="mini"
              ></el-input-number>条
            </el-col>

            <el-col :xs="22" :sm="4" :md="3" :lg="3" :xl="2">
              <el-button
                @click="tempValueForSearch='';loadPage=1;fn_get_lottery_api_by_id()"
                type="primary"
              >刷新列表</el-button>
            </el-col>
          </el-row>

          <el-table
            :data="planList"
            style="width: 100%"
            :height="fullHeight"
            v-loadmore="fn_load_planList"
          >
            <el-table-column type="index" :index="1" sortable></el-table-column>
            <el-table-column prop="lotteryID" label="彩种代号" sortable width="140"></el-table-column>
            <el-table-column prop="id" label="彩种ID" sortable width="140"></el-table-column>
            <el-table-column prop="lotteryname" label="彩种名称" sortable width="300">
              <template slot-scope="prop">
                <span class="nowrap">
                  <el-button
                    @click="fn_show_onePlan(prop.row)"
                    type="primary"
                    icon="el-icon-thumb"
                    size="mini"
                    circle
                  ></el-button>
                  {{prop.row.lotteryname}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="mark2" label="分类" sortable width="140"></el-table-column>
            <el-table-column prop="mark1" label="排序" sortable width="140"></el-table-column>
            <el-table-column prop="switch" label="开启" sortable width="140">
              <template slot-scope="prop">{{prop.row.switch=="1"?"开":"关"}}</template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="prop">
                <el-button
                  type="danger"
                  @click="fn_show_myWebSet(prop.row)"
                  icon="el-icon-delete"
                  size="mini"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MulForm from "./components/MulForm.vue";

import TinymceEditor from "./components/TinymceEditor";

export default {
  name: "app",
  components: {
    MulForm,
    TinymceEditor
  },
  data() {
    return {
      key: 0,
      fullHeight: "800",
      bulletin: "欢迎回来",
      myAPI: "",
      myPlanAPI: "",
      userInfo: { id: "" },
      loginUserLimit: {
        create_user_3: "0",
        create_user_2: "0",
        create_user_1: "0"
      },

      loginForm: {
        name: "",
        psw: "",
        labelWidth: "4em",
        visible: true
      },

      changePSW: {
        oldPSW: "",
        newPSW: "",
        reNewPSW: "",
        labelWidth: "",
        visible: false
      },

      isAdmin: false,

      restaurants: [],
      timerMark: null,

      diaTableUpdateMark: null, //仅为了回调时使用数据
      tempValueForSearch: "",
      sortSelectPicked: "1",

      loadSign: true,
      loadLimit: 20,
      loadPage: 1,

      myWebSet: [], //[{ userID: "" }], //显示默认可见的信息及登录者可修改的信息
      myWebSetLimit: null, //登录者的权限可修改的信息
      childIdForgetLimit: "", //获取的当前child的权限

      selectUserLimit: [],

      authorizeSelectPicked: "search",
      authorizeList: [], // [{ userID: "" }], //显示默认 分享授权 的信息

      myUserSelectPicked: "search",
      myUser: [],
      myUserLimit: [],

      changUserTo: "",
      addUserFrom: "",
      creatSelectPicked: "3",

      planSelectPicked: "search",
      planList: [],

      myEditor: {
        title: "活动编辑器",
        content: "你好，欢迎使用！",
        visible: false
      },

      arrayTable: {
        title: "你好",
        name: "", //翻译用的，数据库表名
        visible: false,
        noShowkey: [], //不展示的jsonkey
        data: []
      },

      diaTable: {
        title: "你好",
        visible: false,
        data: [{ userID: "" }]
      },

      dynamicValidateForm: {
        key: this.key++,
        visible: false,
        title: "你好",
        addTemp: [
          {
            label: "label_item",
            value: "label_item"
          }
        ],
        dynamicInputs: [
          [
            {
              label: "label_item",
              value: "label_item"
            }
          ]
        ]
      }
    };
  },
  computed: {
    c_my_api() {
      return {
        user: this.myAPI + "zz.user.php",
        admin: this.myAPI + "zz.admin.php",
        plan: this.myPlanAPI
      };
    }
  },
  watch: {
    tempValueForSearch() {
      const that = this;
      that.timerMark = setTimeout(function() {
        clearTimeout(that.timerMark);
        let m = 0;
        that.restaurants.forEach(element => {
          if (element.value == that.tempValueForSearch) {
            m++;
          }
        });
        if (m == 0) {
          that.restaurants.unshift({
            value: that.tempValueForSearch
          });
          if (that.restaurants.length > 10) {
            that.restaurants.splice(-1, 1);
          }
        }

        localStorage.restaurants = JSON.stringify(that.restaurants);
      }, 1000);
    }
  },
  created() {
    let that = this;

    //获取页面高度，以便全屏显示
    that.fullHeight = document.documentElement.clientHeight - 75;
    const searchJson = that.$$.getSearch(); // if (searchJson.hasOwnProperty("chat")) {

    //获取当前登录网址的站长配置（后台网址应该也加入到一个专用代理的网站下）
    localStorage.mySite = window.location.hostname;
    localStorage.formSite =
      document.referrer === "" ? "直接输入网址" : document.referrer;

    //获取后台API服务器地址
    that.fn_get_my_api().then(function(e) {
      console.log(">>> fn_get_my_api >>> " + e);
      console.log(e);
      const api = e.data.split("||");
      that.myAPI = api[0];
      that.myPlanAPI = api[1];
      if (that.c_my_api.admin.indexOf("http") === 0) {
        //获取公告
        that.fn_get_bulletin().then(function(e) {
          console.log(">>> fn_get_bulletin 公告 >>> " + e);
          console.log(e);
          that.bulletin = e.data.data;
        });

        //登录——后期需要另外写
        // that.__login();
        that.__relogin();

        //获取计划名称及ID，用于writeType['webSetting']['apiSelect_options']
      }
    });
  },
  methods: {
    //json资料页面，编辑器样式的修改 公告
    fn_bulletin_to_editor() {
      const that = this;
      const __data = {
        ele: "bulletin",
        key: "bulletin",
        keyCN: "bulletin",
        value: that.bulletin,
        userID: "bulletin",
        switchLimit: {
          form: "bulletin",
          key: "bulletin",
          userLimitValue: "bulletin",
          myLimitValue: "bulletin"
        }
      };
      that.diaTableUpdateMark = __data;
      console.log(__data);
      that.myEditor.content = __data.value;
      that.myEditor.visible = true;
    },
    fn_editor_click(e, editor) {
      console.log("Element clicked");
      console.log(e);
      console.log(editor);
    },
    fn_editor_close() {
      const that = this;
      this.$confirm("确认放弃修改并关闭？")
        .then(_ => {
          that.myEditor.visible = false;
        })
        .catch(_ => {});
    },
    fn_editor_clear() {
      this.$confirm("确认清空编辑器的内容？")
        .then(_ => {
          this.$refs.editor.clear();
        })
        .catch(_ => {});
    },
    /* start
 * @触发 切换菜单选项
 * 
 end */
    fn_tab_click() {
      const that = this;

      const id = event.target.getAttribute("id");
      switch (id) {
        case "tab-1":
          //代理网站——获取当前登录者的所有线下网站列表
          that.tempValueForSearch = "";
          that.loadPage = 1;
          break;
        case "tab-2":
          //计划授权——获取当前登录者的所有 黑名单、白名单
          that.tempValueForSearch = "";
          break;
        case "tab-3":
          that.tempValueForSearch = "";

          break;
        case "tab-4":
          that.tempValueForSearch = "";
          break;
        default:
          console.log("click", id); //获取到当前元素的i
      }
    },
    /* start
 * @触发 调用
 * @作用 获取 所有线下的网站列表
 * @param uid,that.userInfo.agentAdmin == "0" that.tempValueForSearch that.userInfo.id
 * @param childID
 *  
 * 
 * 需要再获取此代理的权限
 end */
    fn_get_web_set_by_id() {
      const that = this;
      that
        .fn_async_get_web_set_by_id()
        .then(function(re) {
          that.$$.console.black(
            "agent >>>>>>>>> fn_get_web_set_by_id >>>>>>>>>>>> " + re.data.msg
          );
          console.log(re.data);
          if (re.data.code === "1") {
            if (that.loadPage == 1) {
              that.myWebSet = re.data.data.set; //显示默认可见的信息及登录者可修改的信息
            } else {
              that.myWebSet = that.myWebSet.concat(re.data.data.set); //显示默认可见的信息及登录者可修改的信息
            }

            that.myWebSetLimit = re.data.data.limit; //登录者的权限可修改的信息
          } else if (re.data.code === "2") {
            that.$notify.info({
              title: "加载结束！",
              message: "没有信息了"
            });
          } else if (re.data.code === "-9") {
            that.fn_alert_err("登录超时");
          } else {
            that.fn_alert_err(re.data.msg);
          }
          //  that.webSet = re.data.data;
        })
        .catch(function(error) {
          // handle error
          that.fn_alert_err("fn_async_get_web_set_by_id");
          console.log("error-->fn_async_get_web_set_by_id");
          console.warn(error);
        })
        .then(function() {
          // always executed
        });
    },
    fn_load_myWebSet() {
      const that = this;

      if (that.loadSign) {
        that.loadSign = false;

        that.loadPage++;

        that.fn_get_web_set_by_id();

        setTimeout(() => {
          that.loadSign = true;
        }, 1000);

        console.log("到底了", that.loadPage);
      }
    },
    /* start
 * @触发 代理网站页面，点击表格某行时执行
 * @作用 
 * @param webItem,当前行所在的网站配置
 * @param event
 * 
 * 需要再获取此代理的权限
 end */
    fn_show_myWebSet(webItem, column333, event) {
      let that = this;
      console.log(webItem);
      //获取此代理的权限列表//获取此代理的权限列表//获取此代理的权限列表
      //获取此代理的权限列表//获取此代理的权限列表//获取此代理的权限列表
      that.childIdForgetLimit = webItem.userID;
      that.fn_get_limit_by_childID(function() {
        console.log("fn_get_limit_by_childID-->that.selectUserLimit");
        console.log(that.selectUserLimit);

        let arr = [];
        for (var key in webItem) {
          ///////过滤显示ID 开始/////////////////
          if ((key == "id" || key == "userID") && !that.isAdmin) {
            continue;
          }
          /////////////// 结束 /////////////////

          arr.push({
            ele: "webSetting",
            key: key,
            keyCN: that.$chinese.webSetting[key],
            value: webItem[key],
            userID: webItem["userID"],
            switchLimit: {
              form: "adminLimit",
              key: "webSetting_" + key,
              userLimitValue: that.selectUserLimit[0]["webSetting_" + key],
              myLimitValue: that.myWebSetLimit[key]
            }
          });
        }

        let selectUserLimitItem = that.selectUserLimit[0];
        console.log(selectUserLimitItem);
        let limitKey = ["id", "userID", "userName"];

        for (let key in selectUserLimitItem) {
          ///////过滤显示ID 开始/////////////////
          if (limitKey.indexOf(key) != -1 && !that.isAdmin) {
            continue;
          }

          if (key.indexOf("webSetting_") != -1) {
            continue;
          }

          if (
            (key == "show_all_user" ||
              key == "user_agentStatus" ||
              key == "user_agentAdmin") &&
            !that.isAdmin
          ) {
            continue;
          }

          if (that.loginUserLimit[key] != 1) {
            continue;
          }
          /////////////// 结束 /////////////////

          arr.push({
            ele: "adminLimit",
            key: key,
            keyCN: that.$chinese.adminLimit[key],
            value: ">>>站长权限管理>>>",
            userID: selectUserLimitItem["userID"],
            switchLimit: {
              form: "adminLimit",
              key: key,
              userLimitValue: selectUserLimitItem[key],
              myLimitValue: that.loginUserLimit[key]
            }
          });
        }

        console.log(arr);
        that.diaTable.title = "你好，这是 " + webItem.userName + " 的网站配置";
        that.diaTable.data = arr;
        that.diaTable.visible = true;
      });
    },
    fn_show_onePlan(planItem) {
      let that = this;
      console.log(planItem);

      let arr = [];
      for (var key in planItem) {
        arr.push({
          ele: "api",
          key: key,
          keyCN: that.$chinese.api[key],
          value: planItem[key],
          userID: planItem["id"],
          switchLimit: {
            form: "adminLimit",
            key: "api_" + key,
            userLimitValue: "1",
            myLimitValue: "1"
          }
        });
      }

      console.log(arr);
      that.diaTable.title =
        "你好，这是 [ " + planItem.lotteryname + " ] 计划的资料";
      that.diaTable.data = arr;
      that.diaTable.visible = true;
    },
    /* start
 * @触发 调用 
 * @作用 获取此代理的权限
 * @param 回调callback,可选
 * @param 需要先设置childIdForgetLimit
 * 
 end */
    fn_get_limit_by_childID(callback) {
      const that = this;
      that.fn_async_get_limit_by_childID().then(function(re) {
        that.$$.console.black(
          "agent >>>>>>>>> fn_get_limit_by_childID >>>>>>>>>>>> " + re.data.msg
        );
        console.log(re.data);
        if (re.data.code === "1") {
          that.selectUserLimit = re.data.data;
          if (callback) {
            callback();
          }
        } else if (re.data.code === "-9") {
          that.fn_alert_err("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert_err(re.data.msg);
        }
        //  that.webSet = re.data.data;
      });
    },

    /* start
 * @触发 调用 
 * @作用 获取此登录者的黑、白名单
 * 
 * 
 * 
 end */
    fn_get_my_authorize_list() {
      const that = this;

      that.fn_async_get_my_authorize_list().then(function(re) {
        that.$$.console.black(
          "admin >>>>>>>>> fn_async_get_my_authorize_list >>>>>>>>>>>> " +
            re.data.msg
        );
        console.log(re.data);
        if (re.data.code === "1") {
          if (that.loadPage == 1) {
            that.authorizeList = re.data.data;
          } else {
            that.authorizeList = that.authorizeList.concat(re.data.data);
          }
        } else if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert(re.data.msg);
        }
      });
    },
    fn_load_myAuthorizeList() {
      const that = this;

      if (that.loadSign) {
        that.loadSign = false;

        that.loadPage++;

        that.fn_get_my_authorize_list();

        setTimeout(() => {
          that.loadSign = true;
        }, 1000);

        console.log("到底了", that.loadPage);
      }
    },

    fn_authorizeList_wbStatus_select(newSelectVale, row) {
      const that = this;

      // that.fn_alert(newSelectVale);
      // that.fn_alert_err(row);
      const markPicked = that.authorizeSelectPicked;
      that.authorizeSelectPicked = newSelectVale;
      that.tempValueForSearch = row.userID;
      that.fn_authorize_list_add();
      //清空搜索信息，还原 authorizeSelectPicked 的值
      that.tempValueForSearch = "";
      that.authorizeSelectPicked = markPicked;
    },
    fn_authorize_list_add() {
      const that = this;
      if (that.tempValueForSearch == "") {
        that.fn_alert("请填写会员账号");
        return;
      }

      that
        .fn_async_authorize_list_add(
          that.tempValueForSearch,
          that.authorizeSelectPicked
        )
        .then(function(re) {
          if (re.data.code === "-9") {
            that.fn_alert("登录超时");
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          that.$$.console.black(
            "admin >>>>>>>>> fn_authorize_list_add >>>>>>>>>>>> " + re.data.msg
          );
          that.fn_alert(re.data.msg);
        });
    },

    fn_get_share_ip_list_by_code(shareCode) {
      const that = this;

      that.fn_async_get_share_ip_list_by_code(shareCode).then(function(re) {
        that.$$.console.black(
          "admin >>>>>>>>> fn_get_share_ip_list_by_code >>>>>>>>>>>> " +
            re.data.msg
        );
        console.log(re.data);
        if (re.data.code === "1") {
          console.log(re.data.data);
          if (re.data.data.length > 0) {
            that.arrayTable.title =
              "你好，这是分享码 " + shareCode + " 的IP列表";
            that.arrayTable.name = "shareIP";
            that.arrayTable.data = re.data.data;
            that.arrayTable.noShowkey = [
              "id",
              "mark1",
              "mark2",
              "mark3",
              "mark4",
              "mark5",
              "shareCode",
              "shareExpired"
            ];
            that.arrayTable.visible = true;
          } else {
            that.fn_alert("分享码[" + shareCode + "]暂无分享数据");
          }
        } else if (re.data.code === "-9") {
          that.fn_alert_warn("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert_warn(re.data.msg);
        }
      });
    },

    fn_get_my_userList() {
      const that = this;
      that.fn_async_get_my_userlist().then(function(re) {
        that.$$.console.black(
          "admin >>>>>>>>> fn_get_my_userList >>>>>>>>>>>> " + re.data.msg
        );

        console.log(re.data);
        if (re.data.code === "1") {
          if (that.loadPage == 1) {
            that.myUser = re.data.data.userList; //显示默认可见的信息及登录者可修改的信息
          } else {
            that.myUser = that.myUser.concat(re.data.data.userList); //显示默认可见的信息及登录者可修改的信息
          }

          that.myUserLimit = re.data.data.userLimit; //登录者的权限可修改的信息

          console.log(re.data.data);
        } else if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert(re.data.msg);
        }
        //  that.webSet = re.data.data;
      });
    },
    fn_load_myUser() {
      const that = this;

      if (that.loadSign) {
        that.loadSign = false;

        that.loadPage++;

        that.fn_get_my_userList();

        setTimeout(() => {
          that.loadSign = true;
        }, 1000);

        console.log("到底了", that.loadPage);
      }
    },
    fn_show_user_by_name(n) {
      const that = this;

      that.tempValueForSearch = n || that.tempValueForSearch;

      if (that.tempValueForSearch == "") {
        that.fn_alert("请填写会员账号");
        return;
      }

      that.fn_async_show_user_by_name().then(function(re) {
        that.$$.console.black(
          "admin >>>>>>>>> fn _show_user_by_name >>>>>>>>>>>> " + re.data.msg
        );
        // that.userList = re.data.data.userList;
        // that.userLimit = re.data.data.userLimit;
        if (re.data.code === "1") {
          //that.myUser = re.data.data.userList; //显示默认可见的信息及登录者可修改的信息
          // that.myUserLimit = re.data.data.userLimit; //登录者的权限可修改的信息

          console.log(re.data);
          let userInfoItem = re.data.data.userList[0];
          let myLimit = re.data.data.userLimit; //登录者的权限可修改的信息

          let arr = [];
          let limitKey = [
            "id",
            "userID",
            "nextCount",
            "nextCanShow",
            "agentAdmin"
          ];
          for (var key in userInfoItem) {
            ///////过滤显示ID 开始/////////////////
            if (limitKey.indexOf(key) != -1 && !that.isAdmin) {
              continue;
            }
            /////////////// 结束 /////////////////

            arr.push({
              ele: "user",
              key: key,
              keyCN: that.$chinese.user[key],
              value: userInfoItem[key],
              userID: userInfoItem["id"],
              switchLimit: {
                form: "adminLimit",
                key: "user_" + key,
                userLimitValue: 0,
                myLimitValue: myLimit[key]
              }
            });
          }
          console.log(arr);
          that.diaTable.title =
            "你好，这是 " + userInfoItem.userName + " 的会员资料";
          that.diaTable.data = arr;
          that.diaTable.visible = true;
        } else if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert(re.data.msg);
        }
      });
    },

    fn_create_one_user() {
      const that = this;
      if (that.addUserFrom == "" && that.userInfo.agentAdmin == 0) {
        that.fn_alert(
          "不能将会员归到管理员（管理员的直接下线必须为总代），请将会员/代理归属到一个代理账号下"
        );
        return;
      }

      if (that.tempValueForSearch == "") {
        that.fn_alert("请填写会员账号");
        return;
      }

      that.fn_async_create_one_user().then(function(re) {
        if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        }

        that.$$.console.black(
          "admin >>>>>>>>> fn_authorize_list_submit_to_add >>>>>>>>>>>> " +
            re.data.msg
        );
        that.fn_alert(re.data.msg);
      });
    },

    fn_change_agent() {
      const that = this;

      if (that.tempValueForSearch == "") {
        that.fn_alert("请填写会员账号");
        return;
      }

      if (that.changUserTo == "") {
        that.fn_alert("请填写归属代理账号");
        return;
      }

      that.fn_async_change_agent().then(function(re) {
        if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        }

        that.$$.console.black(
          "admin >>>>>>>>> fn_async_change_agent >>>>>>>>>>>> " + re.data.msg
        );
        that.fn_alert(re.data.msg);
      });
    },
    fn_delete_lottery_api_by_id(lotteryID) {
      const that = this;
      this.$confirm(
        "此操作将永久删除[" + lotteryID + "]计划, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          that.tempValueForSearch = lotteryID;
          that.fn_get_lottery_api_by_id("delete");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    fn_get_lottery_api_by_id(mark) {
      const that = this;
      mark = mark || "get";
      if (mark == "create") {
        if (that.tempValueForSearch == "") {
          that.fn_alert("请填写要新增的彩种的代号");
          return;
        }
      }
      if (mark == "delete") {
        if (that.tempValueForSearch == "") {
          that.fn_alert("请填写要删除的彩种的代号");
          return;
        }
      }
      that.fn_async_get_lottery_api_by_id(mark).then(function(re) {
        that.$$.console.black(
          "admin >>>>>>>>> fn_get_lottery_api_by_id >>>>>>>>>>>> " + re.data.msg
        );
        console.log(re.data);
        if (re.data.code === "1") {
          if (mark == "get") {
            if (that.loadPage == 1) {
              that.planList = re.data.data;
            } else {
              that.planList = that.planList.concat(re.data.data);
            }
          } else {
            that.fn_alert(re.data.msg);
            setTimeout(() => {
              that.tempValueForSearch = "";
              that.loadPage = 1;
              that.fn_get_lottery_api_by_id();
            }, 1000);
          }
        } else if (re.data.code === "-9") {
          that.fn_alert("登录超时");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          that.fn_alert(re.data.msg);
        }
        //  that.webSet = re.data.data;
      });
    },
    fn_load_planList() {
      const that = this;

      if (that.loadSign) {
        that.loadSign = false;

        that.loadPage++;

        that.fn_get_lottery_api_by_id();

        setTimeout(() => {
          that.loadSign = true;
        }, 1000);

        console.log("到底了", that.loadPage);
      }
    },

    async fn_async_get_lottery_api_by_id(mark) {
      mark = mark + "MyLotteryApi";
      const that = this;
      const data_ = that.$qs.stringify({
        type: mark,
        uid: that.userInfo.id,
        childID: that.tempValueForSearch || "",
        token: that.userInfo.loginToken,
        sort: that.sortSelectPicked,
        n: that.loadLimit,
        page: that.loadPage
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_change_agent() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "changeAgent",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        childID: that.tempValueForSearch,
        userName: that.changUserTo
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },
    async fn_async_create_one_user() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "createOneUser",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        userName: that.tempValueForSearch,
        userLevel: that.creatSelectPicked,
        fromUserID:
          that.addUserFrom == "" ? that.userInfo.userName : that.addUserFrom
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_show_user_by_name() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getUserByName",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        userName: that.tempValueForSearch
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_get_my_userlist() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getMyUsers",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        userName:
          that.tempValueForSearch == ""
            ? that.userInfo.userName
            : that.tempValueForSearch,
        sort: that.sortSelectPicked,
        n: that.loadLimit,
        page: that.loadPage
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_get_share_ip_list_by_code(shareCode) {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getMyShareIPList",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        shareCode: shareCode
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_authorize_list_add(userName, wbStatus) {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "insertAuthorization",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        userName: userName,
        wbStatus: wbStatus
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_get_my_authorize_list() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getMyAuthorizeList",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        childID: that.tempValueForSearch,
        sort: that.sortSelectPicked,
        n: that.loadLimit,
        page: that.loadPage
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_get_limit_by_childID() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getLimitsByID",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        childID: that.childIdForgetLimit
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },

    async fn_async_get_web_set_by_id() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getMySiteSetting",
        uid: that.userInfo.id,
        childID:
          that.userInfo.agentAdmin == "0"
            ? that.tempValueForSearch
            : that.userInfo.id,
        token: that.userInfo.loginToken,
        sort: that.sortSelectPicked,
        n: that.loadLimit,
        page: that.loadPage
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },
    async fn_get_my_api() {
      const that = this;
      try {
        const response = await that.$axios.get("mySql.txt");
        return response;
      } catch (error) {
        console.warn(error);
      }
    },
    async fn_get_bulletin() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "getBulletin",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },
    async fn_async_set_bulletin() {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "setBulletin",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        bulletin: that.bulletin
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },
    fn_alert(msg) {
      this.$notify.info({
        title: "系统消息",
        message: msg
      });
    },
    fn_alert_suc(msg) {
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      });
    },
    fn_alert_warn(msg) {
      this.$notify({
        title: "警告",
        message: msg,
        type: "warning"
      });
    },
    fn_alert_err(msg) {
      this.$notify.error({
        title: "错误",
        message: msg
      });
    },
    fn_sort_by(JsonName, str) {
      if (!str) return;
      let __json = this[JsonName];
      sessionStorage.markxxx = sessionStorage.markxxx
        ? Number(sessionStorage.markxxx) * -1
        : 1;
      let t = Number(sessionStorage.markxxx);
      this.$$.sortBy(__json, str, t);
    },
    fn_sort_method(a, b) {
      let c = a.userID - b.userID;
      console.log(c);
      return c;
    },

    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //switch
    switchChang(newValue, obj) {
      console.log(newValue);
      console.log(obj);
      const that = this;
      that
        .fn_async_to_update(
          "doChange",
          that.userInfo.id,
          that.userInfo.loginToken,
          obj.userID,
          obj.switchLimit.form,
          obj.switchLimit.key,
          newValue
        )
        .then(function(re) {
          if (re.data.code === "-9") {
            that.fn_alert_err(re.data.msg);
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          that.$$.console.black(
            "admin >>>>>>>>> switchChang_to_update >>>>>>>>>>>> " + re.data.msg
          );
          console.log(re.data);
          if (re.data.code != "1") {
            that.fn_alert_err(re.data.msg);
          } else {
            that.fn_alert_suc(re.data.msg);
          }
        });
    },
    //json资料页面，多行文本修改回调
    fn_get_dynamicValidateForm(dynamicInputs) {
      const that = this;
      console.log(dynamicInputs);

      let __value = ""; //组装成   九肖|马鼠虎蛇猪龙兔牛猴||六肖|马鼠虎蛇猪龙||四肖|马鼠虎蛇
      let __valueAr = [];
      if (Array.isArray(dynamicInputs)) {
        dynamicInputs.forEach((arr2, i) => {
          let _temp = "";
          let _temAr = [];
          if (Array.isArray(arr2)) {
            arr2.forEach((obj, i) => {
              _temAr.push(obj.value);
            });
            _temp = _temAr.join("|");
          } else {
            _temp = arr2;
          }
          __valueAr.push(_temp);
        });
        __value = __valueAr.join("||");
      } else {
        __value = dynamicInputs;
      }
      __value = __value.replace(/\"/g, "&quot;");
      __value = __value.replace(/\'/g, "&apos;");

      console.log(__value);
      //////////////////////////////////
      const __data = that.diaTableUpdateMark;
      const value = __value;
      console.log(__data);
      //////////////////////////////////
      that
        .fn_async_to_update(
          "doChange",
          that.userInfo.id,
          that.userInfo.loginToken,
          __data.userID,
          __data.ele,
          __data.key,
          value
        )
        .then(function(re) {
          if (re.data.code === "-9") {
            that.fn_alert_err(re.data.msg);
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          that.$$.console.black(
            "admin >>>>>>>>> fn_get_dynamicValidateForm >>>>>>>>>>>> " +
              re.data.msg
          );
          console.log(re.data);
          if (re.data.code != "1") {
            that.fn_alert_err(re.data.msg);
          } else {
            that.dynamicValidateForm.visible = false;
            that.diaTable.visible = false;
            that.fn_alert_suc(re.data.msg);
            if (__data.ele == "webSetting") {
              that.fn_get_web_set_by_id();
            }
          }
        });
      //////////////////////////////////
    },

    //json资料页面，编辑器 回调
    fn_myEditor_yes() {
      const that = this;

      this.$confirm("确认提交修改？")
        .then(_ => {
          // __value = __value.replace(/\"/g, "&quot;");
          // __value = __value.replace(/\'/g, "&apos;");

          //////////////////////////////////
          const __data = that.diaTableUpdateMark;
          const value = that.myEditor.content;
          console.log(__data);
          console.log(value);

          if (__data.ele == "bulletin") {
            that.bulletin = that.myEditor.content;

            that
              .fn_async_set_bulletin()
              .then(function(re) {
                that.$$.console.black(
                  "admin >>>>>>>>> fn_async_set_bulletin >>>>>>>>>>>> " +
                    re.data.msg
                );
                console.log(re.data);
                if (re.data.code === "1") {
                  that.fn_alert("修改成功");

                  that.myEditor.visible = false;
                  that.bulletin = that.myEditor.content;
                  that.myEditor.content = "";
                } else if (re.data.code === "-9") {
                  that.fn_alert_err("登录超时");
                } else {
                  that.fn_alert_err(re.data.msg);
                }
                //  that.webSet = re.data.data;
              })
              .catch(function(error) {
                // handle error
                that.fn_alert_err("fn_async_set_bulletin");
                console.log("error-->fn_async_set_bulletin");
                console.warn(error);
              })
              .then(function() {
                // always executed
              });

            return;
          }
          //////////////////////////////////
          that
            .fn_async_to_update(
              "doChange",
              that.userInfo.id,
              that.userInfo.loginToken,
              __data.userID,
              __data.ele,
              __data.key,
              value
            )
            .then(function(re) {
              that.myEditor.visible = false;

              if (re.data.code === "-9") {
                that.fn_alert_err(re.data.msg);
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }
              that.$$.console.black(
                "admin >>>>>>>>> fn_get_dynamicValidateForm >>>>>>>>>>>> " +
                  re.data.msg
              );
              console.log(re.data);
              if (re.data.code != "1") {
                that.fn_alert_err(re.data.msg);
              } else {
                that.dynamicValidateForm.visible = false;
                that.diaTable.visible = false;
                that.fn_alert_suc(re.data.msg);
                if (__data.ele == "webSetting") {
                  that.fn_get_web_set_by_id();
                }
              }
            });
          //////////////////////////////////
        })
        .catch(_ => {});
    },

    //json资料页面，编辑器样式的修改
    fn_diaTable_update_editor(__data) {
      const that = this;
      that.diaTableUpdateMark = __data;
      console.log(__data);
      that.myEditor.content = __data.value;
      that.myEditor.visible = true;
    },
    //json资料页面，下拉框模式的修改
    fn_diaTable_update_select(value, __data) {
      const that = this;
      //////////////////////////////////
      that
        .fn_async_to_update(
          "doChange",
          that.userInfo.id,
          that.userInfo.loginToken,
          __data.userID,
          __data.ele,
          __data.key,
          value
        )
        .then(function(re) {
          if (re.data.code === "-9") {
            that.fn_alert_err(re.data.msg);
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          that.$$.console.black(
            "admin >>>>>>>>> fn_diaTable_update_select >>>>>>>>>>>> " +
              re.data.msg
          );
          console.log(re.data);
          if (re.data.code != "1") {
            that.fn_alert_err(re.data.msg);
          } else {
            that.fn_alert_suc(re.data.msg);
            if (__data.ele == "webSetting") {
              that.fn_get_web_set_by_id();
            }
          }
        });
      //////////////////////////////////
    },
    //json资料页面，多行文本修改，显示（还有一个回调
    fn_diaTable_update_multiline(__data) {
      const that = this;
      that.diaTableUpdateMark = __data;
      console.log("__keys.indexOf(__data.key)");
      let labelCN = that.$writeType["webSetting"][__data.key + "_options"];
      let __arr = __data.value.split("||");
      __arr.forEach((element, index) => {
        let __arr2 = element.split("|");
        __arr[index] = __arr2;
        __arr2.forEach((element2, index2) => {
          let labelCNindex2 = index2 % labelCN.length;
          __arr[index][index2] = {
            label: labelCN[labelCNindex2],
            value: element2
          };
        });
      });
      let addTemp = [];
      labelCN.forEach(__labelCN => {
        addTemp.push({
          label: __labelCN,
          value: ""
        });
      });
      that.dynamicValidateForm.addTemp = addTemp;
      that.dynamicValidateForm.dynamicInputs = __arr;
      that.dynamicValidateForm.visible = true;
    },
    //json资料页面，input模式的修改
    fn_diaTable_update_input(__data) {
      const that = this;
      that.diaTableUpdateMark = __data;
      if (__data.switchLimit.myLimitValue !== "1") {
        return;
      }

      console.log('his.$prompt("请输入", __data.keyCN');

      this.$prompt("请输入", __data.keyCN, {
        closeOnClickModal:false,
        inputValue: __data.value,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        //  inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        //   inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          //////////////////////////////////
          that
            .fn_async_to_update(
              "doChange",
              that.userInfo.id,
              that.userInfo.loginToken,
              __data.userID,
              __data.ele,
              __data.key,
              value
            )
            .then(function(re) {
              if (re.data.code === "-9") {
                that.fn_alert_err(re.data.msg);
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }
              that.$$.console.black(
                "admin >>>>>>>>> fn_diaTable_update_input >>>>>>>>>>>> " +
                  re.data.msg
              );
              console.log(re.data);
              if (re.data.code != "1") {
                that.fn_alert_err(re.data.msg);
              } else {
                that.fn_alert_suc(re.data.msg);
                that.fn_get_web_set_by_id();
                that.diaTable.visible = false;
              }
            });
          //////////////////////////////////
        })
        .catch(() => {
          that.fn_alert("取消输入");
        });
    },
    //暂时没有用到
    fn_to_update(key, value) {
      if (!value) {
        return;
      }
      this.$$.console.blue("admin want to change " + key + " => " + value);
      const that = this;

      const keyArr = key.split("|");
      const form = keyArr[0];
      const formKey = keyArr[1];
      const userID = keyArr.length >= 3 ? keyArr[2] : that.userInfo.id;
      that
        .fn_async_to_update(
          "doChange",
          that.userInfo.id,
          that.userInfo.loginToken,
          userID,
          form,
          formKey,
          value
        )
        .then(function(re) {
          if (re.data.code === "-9") {
            that.fn_alert("登录超时");
            setTimeout(() => {
              location.reload();
            }, 2000);
          }

          that.$$.console.black(
            "admin >>>>>>>>> fn_to_update >>>>>>>>>>>> " + re.data.msg
          );
          console.log(re.data);

          that.fn_alert(re.data.msg);

          //  that.webSet = re.data.data;
        });
    },
    async fn_async_to_update(
      type,
      uid,
      token,
      childID,
      form,
      formKey,
      formValue
    ) {
      const that = this;
      const data_ = that.$qs.stringify({
        type: type,
        uid: uid,
        token: token,
        childID: childID,
        form: form,
        formKey: formKey,
        formValue: formValue
      });
      try {
        return await that.$axios.post(that.c_my_api.admin, data_);
      } catch (error) {
        console.log(that.c_my_api);
        console.warn(error);
      }
    },
    fn_get_selet_option_json(table, key) {
      const that = this;
      let option_arr = that.$writeType[table][key + "_options"];
      let option_json = {};
      option_arr.forEach(element => {
        option_json[element.value] = element.label;
      });
      return option_json;
    },
    fn_change_psw() {
      const that = this;
      // changePSW: {
      //   oldPSW: "",
      //   newPSW: "",
      //   reNewPSW: "",
      //   labelWidth: "",
      //   visible: false
      // },

      if (
        that.changePSW.oldPSW == "" ||
        that.changePSW.newPSW == "" ||
        that.changePSW.reNewPSW == ""
      ) {
        that.fn_alert_err("不能为空");
        return;
      }

      if (!that.$pattJson["userPsw"].test(that.changePSW.oldPSW)) {
        that.fn_alert_err("旧密码错误j");
        return;
      }
      if (!that.$pattJson["userPsw"].test(that.changePSW.newPSW)) {
        that.fn_alert_err("密码需要设置为6-15位英文字母、数字或下划线");
        return;
      }
      if (that.changePSW.newPSW !== that.changePSW.reNewPSW) {
        that.fn_alert_err("两次输入的新密码不一样");
        return;
      }
      const data_ = that.$qs.stringify({
        type: "changePassword",
        uid: that.userInfo.id,
        token: that.userInfo.loginToken,
        password: that.changePSW.oldPSW,
        newpassword: that.changePSW.newPSW
      });

      that.fn_alert("修改中……");

      that.$axios
        .post(that.c_my_api.user, data_)
        .then(function(response) {
          // handle success
          console.log("success-->fn_change_psw:");
          const re = response.data;

          if (re.code == "1") {
            that.fn_alert_suc(re.msg + ", 请用新密码重新登录");
            setTimeout(() => {
              that.__loginOut();
            }, 2000);
          } else {
            that.fn_alert_err(re.msg);
          }
        })
        .catch(function(error) {
          // handle error
          that.fn_alert_err("fn_change_psw");
          console.log("error-->fn_change_psw:");
          console.warn(error);
        })
        .then(function() {
          // always executed
        });
    },
    __loginInit(re) {
      const that = this;

      that.loginForm.visible = false;

      console.log(">>>>>>>>>>>>>>>>....__loginInit >>>>>>>>>>>>>");

      console.log(re.data);

      that.userInfo = re.data;
      if (that.userInfo.id == "1") {
        that.isAdmin = true;
      }
      localStorage.userInfo = JSON.stringify(that.userInfo);
      that.fn_alert_suc(re.msg);
      that.childIdForgetLimit = that.userInfo.id;
      that.addUserFrom = that.userInfo.userName;
      localStorage.restaurants =
        localStorage.restaurants ||
        JSON.stringify([{ value: that.userInfo.userName }]);
      that.restaurants = JSON.parse(localStorage.restaurants);
      that.fn_get_limit_by_childID(function() {
        console.log(
          "fn_get_limit_by_childID-->that.selectUserLimit  for loginUser"
        );
        that.loginUserLimit = that.selectUserLimit[0];
        console.log(that.loginUserLimit);
      });
    },
    __login() {
      let that = this;
      let username = that.loginForm.name;
      let password = that.loginForm.psw;
      // username = "admin";
      // password = "123qwe";
      // username = "kekejh";
      // password = "123456";

      // username = "zdadmin";
      // password = "123qwe";

      if (username == "" || password == "") {
        that.fn_alert_warn("不能为空");
        return;
      }
      const data_ = that.$qs.stringify({
        type: "login",
        username: username,
        password: password,
        aff: localStorage.mySite,
        fromLink: localStorage.fromSite
      });

      that.fn_alert("登录中……");

      that.$axios
        .post(that.c_my_api.user, data_)
        .then(function(response) {
          // handle success
          console.log("success-->fn_PromptTwo_login:");
          console.log(response.data);
          const re = response.data;

          if (re.code == "1") {
            if (re.data.agentStatus == "1") {
              that.__loginInit(re);
            } else {
              that.fn_alert_err("权限不足，请联系管理员");

              that.__loginOut();
            }
          } else {
            that.fn_alert_err(re.msg);
          }
        })
        .catch(function(error) {
          // handle error
          that.fn_alert_err("error：fn_PromptTwo_login");
          console.log("error-->fn_PromptTwo_login:");
          console.warn(error);
        })
        .then(function() {
          // always executed
        });
    },
    __loginOut: function() {
      const that = this;
      that.$$.console.red("log__out");
      localStorage.removeItem("userInfo");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    __relogin(fnCallBack) {
      let that = this;
      ////////check_token
      if (localStorage.userInfo) {
        that.$$.console.red(">>>localStorage.userInfo >>>  yes");
        that
          .fn_async_token_reLogin(JSON.parse(localStorage.userInfo))
          .then(function(e) {
            console.log(e);
            that.$$.console.red(
              ">>> fn_async_token_reLogin >>> " + e.data.code
            );
            console.log(e);
            if (e.data.code === "1") {
              that.__loginInit(e.data);
            } else {
              //// token 失效，无法刷新获取登录的会员信息
              // localStorage.removeItem("userInfo");
              if (typeof fnCallBack === "function") {
                fnCallBack("0");
              } else {
                //   that.loginForm.visible = true;
              }
            }
          });
      } else {
        that.$$.console.blue(">>>localStorage.userInfo >>>  no");
        // that.loginForm.visible = true;
        // that.fn_PromptTwo_login();
      }
    },
    async fn_async_token_reLogin(userInfoJson) {
      const that = this;
      const data_ = that.$qs.stringify({
        type: "reLogin",
        uid: userInfoJson.id,
        token: userInfoJson.loginToken
      });
      try {
        return await that.$axios.post(that.c_my_api.user, data_);
      } catch (error) {
        console.warn(error);
      }
    },
    sortMethodUserID(a, b) {
      let c = a.userID - b.userID;
      // console.log(c);
      return c;
    },
    sortMethod(a, b) {
      let c = a.id - b.id;
      // console.log(c);
      return c;
    },
    sortMethodShareIPCount(a, b) {
      let c = a.shareIPCount - b.shareIPCount;
      // console.log(c);
      return c;
    },
    sortMethodNextCount(a, b) {
      let c = a.nextCount - b.nextCount;
      // console.log(c);
      return c;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
    ///////////// methods end /////////////////
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  height: 100%;
}
.bulletin {
  text-align: left;
}
.height100 {
  max-height: 100%;
}

.select-short .el-input {
  width: 100px;
}

.el-autocomplete-short input {
  width: 100px;
}

.nowrap {
  white-space: nowrap;

  text-overflow: ellipsis;

  overflow: hidden;
}

.nowrap button {
  margin-right: 1em;
}
.ml.el-button {
  margin-left: 0.5em;
}

.badgeitem sup.el-badge__content.is-fixed {
  top: 12px;
}

.tox-silver-sink {
  z-index: 99999999 !important;
}
</style>