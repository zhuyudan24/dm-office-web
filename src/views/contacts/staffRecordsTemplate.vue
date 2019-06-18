<template>
  <div class="template-wrap" :style="{ height: bodyHeight }">
    <div class="template-contain">
      <!-- 头部标题 -->
      <div class="template-head">
        <div class="template-title flex-1">
          <img src="../../assets/logo45_45.png" alt="logo" />
          <span class="template-title-span">员工档案设置</span>
        </div>
        <div class="template-btns flex-1 flex-r">
          <el-button type="primary" plain @click="saveAndBack('preview')">预 览</el-button>
          <el-button type="primary" plain @click="changeRoute('/fileSet')">返 回</el-button>
          <el-button type="primary" @click="saveAndBack('save')">保存并启用</el-button>
        </div>
      </div>
      <!-- 模板body -->
      <div class="template-body">
        <!-- 左侧 -->
        <div class="template-cell template-cell-l">
          <!-- tab 切换 -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="系统字段" name="first">
              <div class="filed-item-title">基本信息</div>
              <ul>
                <draggable id="list1" @clone="baseInfoClone" :list="baseInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd"
                  ><!-- @end="itemMoveEnd" -->
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in baseInfo" :key="index" @mousedown="clickItem(item)" aria-hidden="true">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">工作信息</div>
              <ul>
                <draggable id="list2" :list="jobInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in jobInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">个人信息</div>
              <ul>
                <draggable id="list3" :list="selfInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in selfInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">学历信息</div>
              <ul>
                <draggable id="list4" :list="eduInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in eduInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">合同信息</div>
              <ul>
                <draggable id="list5" :list="contractInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in contractInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">紧急联系人</div>
              <ul>
                <draggable id="list5" :list="contactInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in contactInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">个人材料</div>
              <ul>
                <draggable id="list5" :list="personalInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in personalInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.fieldName }}</span>
                  </li>
                </draggable>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="自定义字段" name="second">
              <div class="filed-item-title"><!-- 其他信息 --></div>
              <ul>
                <draggable id="list5" :list="defineInfo" class="compenent" :options="leftDefineOption" :move="onChildMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-type="item.fieldCode" v-for="(item, index) in defineInfo" :key="index" @mousedown="clickItem(item)">
                    <span v-if="!item.systemFlag && item.fieldType == 0">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 1">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 2">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 3">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 4">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 5">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 6">{{ item.fieldName }}</span>
                    <span v-if="!item.systemFlag && item.fieldType == 7">{{ item.fieldName }}</span>

                    <i v-if="!item.systemFlag && item.fieldType == 0" class="bg-icon bg-icon-one"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 1" class="bg-icon bg-icon-two"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 2" class="bg-icon bg-icon-three"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 3" class="bg-icon bg-icon-four"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 4" class="bg-icon bg-icon-five"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 5" class="bg-icon bg-icon-six"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 6" class="bg-icon bg-icon-seven"></i>
                    <i v-if="!item.systemFlag && item.fieldType == 7" class="bg-icon bg-icon-eight"></i>
                  </li>
                </draggable>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 中间 -->
        <div class="template-cell template-cell-m">
          <div class="phone-view">
            <div class="phone-show-content">
              <!-- 拖拽展示区域 -->
              <div class="drag-show-content">
                <div class="view-container">
                  <ul class="view-content" id="showPhoneView">
                    <template v-if="tempaletDataList.length == 0">
                      <img class="templet-null-img" src="../../assets/templet_null_img.png" />
                    </template>
                    <draggable :options="{ group: { name: 'people', pull: false, put: false }, sort: true }" v-model="tempaletDataList" class="drag-wrap">
                      <li :class="['filed-item', currentIndex == index ? 'active-item' : '', 'li-block']" v-for="(item, index) in tempaletDataList" :key="'li1' + index" @click="selectItem(item.fieldCode, index)">
                        <!-- 删除 -->
                        <span v-if="item.fieldCode != 'baseInfo'" class="item-close p-item-close" @click.stop="deleteItem(item.fieldCode, index)">
                          <i class="el-icon-close"></i>
                        </span>

                        <template>
                          <div class="block">
                            <div class="block-head">
                              <div :class="['opencard-item-title', item.fieldName.length > 6 ? 'block-pre-wrap' : '']">{{ item.fieldName }}</div>
                            </div>
                            <ul class="view-content">
                              <draggable :options="{ group: { name: 'people', pull: false, put: true }, sort: true }" v-model="item.children" :class="['drag-wrap', 'block-wrap', item.fieldCode]" @add="addDragItem">
                                <li :class="['filed-item', 'child-filed-item', currentChildKey == childItem.fieldCode && currentChildIndex == ind ? 'active-item' : '']" v-for="(childItem, ind) in item.children" :key="'li' + ind" @click.stop="selectChildItem(childItem.fieldCode, index, ind, item.children)">
                                  <!-- 删除 -->
                                  <span class="item-close child-item-close" @click.stop="deleteChildItem(childItem.fieldCode, index, ind, item.children, childItem)" v-if="childItem.fieldCode != 'clerkPhone'"
                                    ><!--手机号禁止删除-->
                                    <i class="el-icon-close"></i>
                                  </span>
                                  <!-- item -->
                                  <!-- 单择/多选/日期 -->
                                  <div v-if="childItem.fieldType == 2 || childItem.fieldType == 3 || childItem.fieldType == 4">
                                    <div :class="['opencard-item-title', childItem.fieldName.length > 6 ? 'title-pre-wrap' : '']">{{ childItem.fieldName }}</div>
                                    <div class="draged-item-show">
                                      <span class="show-warm-text show-warm-text-flag select-flag">{{ childItem.fieldDescription }} <i class="el-icon-arrow-right"></i></span>
                                    </div>
                                  </div>
                                  <!-- 日期区间 -->
                                  <div v-if="childItem.fieldType == 5">
                                    <div>
                                      <div :class="['opencard-item-title', childItem.fieldOperations.startName.length > 6 ? 'title-pre-wrap' : '']">{{ childItem.fieldOperations.startName }}</div>
                                      <div class="draged-item-show">
                                        <span class="show-warm-text show-warm-text-flag select-flag">{{ childItem.fieldOperations.startDescription }}<i class="el-icon-arrow-right"></i></span>
                                      </div>
                                    </div>
                                    <div class="b-t-1">
                                      <div :class="['opencard-item-title', childItem.fieldOperations.endName.length > 6 ? 'title-pre-wrap' : '']">{{ childItem.fieldOperations.endName }}</div>
                                      <div class="draged-item-show">
                                        <span class="show-warm-text show-warm-text-flag select-flag">{{ childItem.fieldOperations.endDescription }}<i class="el-icon-arrow-right"></i></span>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- 图片 -->
                                  <div v-if="childItem.fieldType == 7">
                                    <div :class="['opencard-item-title', childItem.fieldName.length > 6 ? 'title-pre-wrap' : '']">{{ childItem.fieldName }}</div>
                                    <div class="draged-item-show">
                                      <span class="show-warm-text show-warm-text-flag select-flag"><i class="iconfont icon-icon"></i></span>
                                    </div>
                                  </div>
                                  <!-- 单行/多行/数字输入框 -->
                                  <div v-if="childItem.fieldType == 0 || childItem.fieldType == 1 || childItem.fieldType == 6">
                                    <div :class="['opencard-item-title', childItem.fieldName.length > 6 ? 'title-pre-wrap' : '']">{{ childItem.fieldName }}</div>
                                    <div class="draged-item-show">
                                      <span class="show-warm-text show-warm-text-flag">{{ childItem.fieldDescription }}</span>
                                    </div>
                                  </div>
                                </li>
                              </draggable>
                            </ul>
                          </div>
                        </template>
                      </li>
                    </draggable>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="template-cell template-cell-r">
          <el-tabs v-model="rightName">
            <el-tab-pane label="控件设置" name="first">
              <div id="edit-box">
                <div class="edit-view baby-info-flag baby-info">
                  <template v-for="(item, index) in tempaletDataList">
                    <!-- 公共 -->
                    <template v-if="currentIndex == index && item.parentCode == '0'">
                      <div class="edit-item " :key="'parent' + index">
                        <div class="edit-item-title edit-title-padding">标题</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.fieldName" :holder="''" :disflag="true" :getByType="'word'" :maxLength="10"> </limitInput>
                      </div>
                    </template>

                    <!-- 组块内部 -->
                    <template v-if="childIndex == index && !!item.children && !!item.children.length">
                      <template v-for="(childItem, ind) in item.children">
                        <!-- 标题 日期区间例外-->
                        <template v-if="currentChildIndex == ind">
                          <div class="edit-item test-title limit-w-340" :key="'child' + ind">
                            <div class="edit-item-title">标题</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldName" :holder="''" :disflag="childItem.systemFlag" :getByType="'word'" :maxLength="10"> </limitInput>
                            <p v-if="childItem.fieldType == 7" style="margin-top: 8px;font-size: 12px;color: rgba(255, 255, 255, 0.7)">
                              {{ childItem.fieldDescription }}
                            </p>
                          </div>
                        </template>

                        <!-- 提示 -->
                        <template v-if="currentChildIndex == ind && !(childItem.fieldType == 5 || childItem.fieldType == 7)">
                          <div class="edit-item test-title limit-w-340" :key="'child1' + ind">
                            <div class="edit-item-title">提示文字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldDescription" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                          </div>
                        </template>

                        <template v-if="currentChildIndex == ind && childItem.fieldType == 5">
                          <div class="edit-item test-title limit-w-340" :key="'child2' + ind">
                            <div class="edit-item-title">开始时间</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldOperations.startName" :holder="''" :disflag="childItem.systemFlag" :getByType="'word'" :maxLength="10"> </limitInput>
                          </div>
                          <div class="edit-item test-title limit-w-340" :key="'child3' + ind">
                            <div class="edit-item-title">提示文字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldOperations.startDescription" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                          </div>
                          <div class="edit-item test-title limit-w-340" :key="'child4' + ind">
                            <div class="edit-item-title">结束时间</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldOperations.endName" :holder="''" :disflag="childItem.systemFlag" :getByType="'word'" :maxLength="10"> </limitInput>
                          </div>
                          <div class="edit-item test-title limit-w-340" :key="'child5' + ind">
                            <div class="edit-item-title">提示文字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldOperations.endDescription" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                          </div>
                        </template>

                        <!-- 单位 -->
                        <template v-if="currentChildIndex == ind && childItem.fieldType == 6">
                          <div class="edit-item test-title limit-w-340" :key="'child6' + ind">
                            <div class="edit-item-title">单位</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.fieldOperations.unit" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                          </div>
                        </template>

                        <!-- 类型 -->
                        <template v-if="currentChildIndex == ind && (childItem.fieldType == 4 || childItem.fieldType == 5)">
                          <div class="edit-item " :key="'child7' + ind">
                            <div class="edit-item-title">日期类型</div>
                            <!-- 日期 -->
                            <template v-for="(types, ind) in childItem.fieldOperations.ruleContent">
                              <el-radio v-model="childItem.fieldOperations.typeValue" :label="types.key" :key="'child8' + ind">
                                {{ types.name }}
                              </el-radio>
                            </template>
                          </div>
                        </template>

                        <!-- 选项 -->
                        <template v-if="currentChildIndex == ind && (childItem.fieldType == '2' || childItem.fieldType == '3')">
                          <div class="edit-item " :key="'child9' + ind">
                            <div class="edit-item-title">选项 <span v-if="!childItem.systemFlag">最多20项，每项最多10个字</span></div>
                            <template v-for="(types, ind) in childItem.fieldOperations.fieldContent">
                              <div class="margin-t-15 limit-w-340" :style="ind == 0 ? 'margin-top: 0' : ''" :key="'child10' + ind">
                                <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="types.name" :holder="''" :disflag="childItem.systemFlag" :getByType="'word'" :maxLength="10"> </limitInput>
                                <i class="opt-btn el-icon-remove del-item" v-if="!childItem.systemFlag && childItem.fieldOperations.fieldContent.length > 1" @click="delChildItem(index, ind, childItem)"></i>
                                <template v-if="!childItem.systemFlag && ind < 19">
                                  <i class="opt-btn el-icon-circle-plus add-item" v-if="ind == childItem.fieldOperations.fieldContent.length - 1" @click="addChildItem(index, ind, childItem)"></i>
                                </template>
                              </div>
                            </template>
                          </div>
                        </template>

                        <!-- 必填 -->
                        <template v-if="currentChildIndex == ind">
                          <div class="edit-item" :key="'child11' + ind">
                            <div class="edit-item-title">验证</div>
                            <el-checkbox v-model="childItem.isMust">必填</el-checkbox>
                          </div>
                        </template>

                        <!-- 公共 -->
                        <template v-if="currentChildIndex == ind">
                          <!-- 员工档案中 -->
                          <div class="edit-item " :key="'parent2' + ind">
                            <div class="edit-item-title">员工档案中</div>
                            <div class="staffRecords-limit">
                              <el-radio class="label-cell" v-model="childItem.staffRecordsIds.staffVisible" label="1">对员工可见</el-radio>
                              <el-radio class="label-cell" v-model="childItem.staffRecordsIds.staffVisible" label="0">对员工不可见</el-radio>
                            </div>
                            <div class="staffRecords-limit">
                              <el-radio class="label-cell" v-model="childItem.staffRecordsIds.staffModify" label="1">对员工可修改</el-radio>
                              <el-radio class="label-cell" v-model="childItem.staffRecordsIds.staffModify" label="0">对员工不可修改</el-radio>
                            </div>
                          </div>
                        </template>
                      </template>
                    </template>
                    <!-- 组块内部 -->
                  </template>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
    <!-- <vue-gic-footer></vue-gic-footer> -->
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import AddInput from '@/components/templateSet/add-input';
import limitInput from '@/components/limit-input.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import allInfo from '@/components/contacts/staffInfoTemplate';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
// import strLength from '@/common/js/strlen';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';

export default {
  name: 'staffRecordsTemplate',
  data() {
    return {
      // tab
      activeName: 'first',
      // right tab
      rightName: 'first',
      dialogVisible: false,
      bodyHeight: (document.documentElement.clientHeight || document.body.clientHeight) + 'px',
      // option
      isDragging: false,
      delayedDragging: false,
      // leftOption
      leftOption: {
        group: { name: 'people', pull: 'clone', put: false },
        sort: false,
        disabled: false
      },
      leftDefineOption: {
        group: { name: 'people', pull: 'clone', put: false },
        sort: false,
        disabled: false
      },
      // rightOption
      selectKey: '',
      // 基本信息
      baseInfo: [],
      // 工作信息
      jobInfo: [],
      // 个人信息
      selfInfo: [],
      // 学历信息
      eduInfo: [],
      // 合同信息
      contractInfo: [],
      // 紧急联系人
      contactInfo: [],
      // 个人材料
      personalInfo: [],
      // 自定义
      defineInfo: allInfo.defineInfo(),
      // 中间数据集合
      currentIndex: 0, //当前选择的 item
      // children
      currentChildKey: null,
      currentChildIndex: null,
      childIndex: 0,

      tempaletDataList: [
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'baseInfo',
          fieldName: '基本信息',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          fieldOperations: {
            ruleContent: [], // 单选 日期有
            fieldContent: [] // 选项
          },
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'jobInfo',
          fieldName: '工作信息',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'selfInfo',
          fieldName: '个人信息',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'eduInfo',
          fieldName: '学历信息',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'contractInfo',
          fieldName: '合同信息',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'contactInfo',
          fieldName: '紧急联系人',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        },
        {
          parentCode: '0',
          fieldTemplateId: '',
          parentFieldTemplateId: '0',
          minCount: 10,
          maxCount: 20,
          fieldCode: 'personalInfo',
          fieldName: '个人资料',
          fieldEdited: false, // 修改（0：不可修改，1：可修改）
          isMust: false,
          fieldDescription: '',
          children: [],
          fieldType: '',
          staffRecordsIds: {},
          status: ''
        }
      ],
      // 添加父级集合
      fieldParent: {
        baseInfo: {},
        jobInfo: {},
        selfInfo: {},
        eduInfo: {},
        contractInfo: {},
        contactInfo: {},
        personalInfo: {}
      },
      // 已经选择的字段集合
      setList: []
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    /**
     * baseInfoClone
     */
    baseInfoClone() {
      // const that = this;
      // that.baseInfo = JSON.parse(JSON.stringify(that.baseInfo))
    },

    /**
     * 点击左侧字段 item
     */
    clickItem(item) {
      const that = this;
      // item.fixed = !item.fixed
      // 判断 中间数据中是否存在父级
      let fieldArr = that.tempaletDataList.map(item => item.fieldCode);
      if (!fieldArr.includes(item.parentCode) && item.parentCode !== 'defineInfo') {
        that.tempaletDataList.push(that.fieldParent[item.parentCode]);
        that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      }
    },

    /**
     * move 检查对应所在组
     */
    checkMove(evt) {
      let flag = true;
      if (evt.draggedContext.element.parentCode == 'baseInfo' && !evt.to.className.includes('baseInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'jobInfo' && !evt.to.className.includes('jobInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'selfInfo' && !evt.to.className.includes('selfInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'eduInfo' && !evt.to.className.includes('eduInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'contractInfo' && !evt.to.className.includes('contractInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'contactInfo' && !evt.to.className.includes('contactInfo')) {
        flag = false;
      }
      if (evt.draggedContext.element.parentCode == 'personalInfo' && !evt.to.className.includes('personalInfo')) {
        flag = false;
      }
      return flag;
    },

    /**
     *  move{relatedContext, draggedContext}
     */
    onMove(evt) {
      const that = this;
      // 判断中间是否存在父级
      if (!that.checkMove(evt)) {
        return false;
      }
      const draggedElement = evt.draggedContext.element;
      return !draggedElement.fixed;
    },

    /**
     *  move child
     */
    onChildMove(evt) {
      let tag = true;
      if (evt.dragged.className.indexOf('block-class') != -1) {
        if (evt.to.className.indexOf('block-wrap') != -1) {
          // tag = false
        }
      }
      return tag;
    },

    /**
     *  move end
     */
    itemMoveEnd(evt) {
      const that = this;
      that.isDragging = false;
      that.selectKey = '';
      that.selectKey = evt.clone.dataset.type;
      // 判断中间是否已经添加
      that.tempaletDataList.forEach(function(ele, index) {
        ele.children.forEach(function(child, key) {
          if (!!child.systemFlag && child.fieldCode == that.selectKey) {
            setKey(child.parentCode);
          }
        });
      });
      /* eslint-disable */
      function setKey(parentCode) {
        /* eslint-disable */
        that[parentCode].forEach(function(ele, index) {
          /* eslint-disable */
          if (ele.fieldCode == that.selectKey) {
            ele.fixed = true;
          }
        });
      }
      that.selectKey = '';
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      that.$forceUpdate();
    },

    // 中间部分方法
    /**
     *  选择 item 即父级 item
     */
    selectItem(key, index) {
      const that = this;
      that.currentIndex = index; // 父级：当前选中的索引
      that.currentChildIndex = null; // 子级未有选中
    },

    /**
     *   删除 item 即父级 item
     */
    deleteItem(key, index) {
      const that = this;
      that.tempaletDataList.splice(index, 1);
      that.currentIndex--;
      if (that.currentIndex <= 0) {
        that.currentIndex = 0;
      }
      // 删除后重新设置 fixed 值
      that[key].forEach(function(ele, index) {
        ele.fixed = false;
      });
    },

    /**
     *  添加 child
     */
    addDragItem(evt) {
      return false;
    },

    /**
     *  选择 item 即子级 item
     */
    selectChildItem(key, index, ind, list) {
      const that = this;
      that.currentIndex = null;
      that.currentChildKey = key;
      that.childIndex = index;
      that.currentChildIndex = ind;
    },

    /**
     *  删除 item 即子级 item
     */
    deleteChildItem(key, index, ind, list, childItem) {
      const that = this;
      that.childIndex = index;
      that.currentIndex = null;
      that.currentChildKey = that.tempaletDataList[index].children[ind].fieldCode;
      that.currentChildIndex--;
      if (that.currentChildIndex <= 0) {
        that.currentChildIndex = 0;
      }
      // list.splice(ind,1)
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      that.tempaletDataList[index].children.splice(ind, 1);

      // 重新设置左侧的 fixed
      that[childItem.parentCode].forEach(function(ele, index) {
        if (ele.fieldCode === key) {
          ele.fixed = false;
        }
      });
    },

    /**
     *  右侧方法
     */
    /**
     *  添加删除选项
     */
    delChildItem(index, ind, item) {
      item.fieldOperations.fieldContent.splice(ind, 1);
    },
    addChildItem(index, ind, item) {
      const that = this;
      // 多选
      if (ind == 19) {
        that.$message.error({
          duration: 1000,
          message: '最多可添加 20 项'
        });
        return;
      } else {
        let type = 'radio';
        if (!item.systemFlag && parseInt(item.fieldType) === 3) {
          type = 'checkbox';
        }
        item.fieldOperations.fieldContent.push({ type: type, name: '请输入选项' });
        // 判断重复字段
        let arrValues = item.fieldOperations.fieldContent.map(ite => ite.name); // 返回对象中键值集合的数组
        if (that.isRepeat(arrValues)) {
          item.fieldOperations.fieldContent.splice(item.fieldOperations.fieldContent.length - 1, 1);
          arrValues.splice(item.fieldOperations.fieldContent.length - 1, 1);
          that.$message.error({
            duration: 1000,
            message: '选项不能重复'
          });
        }
      }
    },

    /**
     *  判断添加重复字段
     */
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },

    /**
     *  路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     *  检查
     */
    checkTag(data) {
      const that = this;
      let tag = {};
      tag.filedFlag = true;
      tag.filedRepeat = false;
      let filedArr = [];
      data.forEach(function(ele, index) {
        if (ele.fieldName == '') {
          tag.filedFlag = false;
          tag.name = ele.fieldName || '';
          return false;
        }
        // 判断子级
        if (!!ele.children.length) {
          ele.children.forEach(function(el, index) {
            if (!!el.systemFlag && el.fieldName == '') {
              tag.filedFlag = false;
              tag.name = el.fieldName || '';
              return false;
            }
            filedArr.push(el.fieldName);
          });
        }
      });
      // 判断重复 fieldName
      if (that.isRepeat(filedArr)) {
        tag.filedRepeat = true;
      }
      return tag;
    },

    /**
     *  获取 uuid
     */
    getUuid() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0;
        let v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    /**
     *  保存
     */
    saveAndBack: _debounce(function (opt) {
      const that = this;
      let data = JSON.parse(JSON.stringify(that.tempaletDataList));
      let tagObj = that.checkTag(data);
      let allLengthData = [];
      // 检查空字段
      if (!tagObj.filedFlag) {
        that.$message.error({
          duration: 1000,
          message: tagObj.name + '字段标题不能为空'
        });
        return;
      }
      if (tagObj.filedRepeat) {
        that.$message.error({
          duration: 1000,
          message: '字段标题不能重复'
        });
        return;
      }
      data.forEach(function(ele, index) {
        ele.sort = index;
        ele.fixed = ele.fixed === true ? 1 : 0;
        ele.isMust = ele.isMust === true ? 1 : 0;
        ele.systemFlag = ele.systemFlag === true ? 1 : 0;
        ele.parentFieldTemplateId = ele.parentFieldTemplateId ? ele.parentFieldTemplateId : -1;
        ele.fieldTemplateId = ele.fieldTemplateId ? ele.fieldTemplateId : -1;
        ele.children.forEach(function(el, ind) {
          allLengthData.push(el);
          el.sort = ind;
          el.fixed = el.fixed === true ? 1 : 0;
          el.isMust = el.isMust === true ? 1 : 0;
          el.systemFlag = el.systemFlag === true ? 1 : 0;
          if (!ele.systemFlag) {
            el.fieldEdited = 1;
          }
          // 选项 key
          if (parseInt(el.fieldType) === 2 || parseInt(el.fieldType) === 3) {
            el.fieldOperations.fieldContent.forEach(function(child, key) {
              child.key = !!String(child.key) ? String(child.key) : '';
              if (!el.systemFlag && (!child.hasOwnProperty('key') || child.key == '' || child.key == 'undefined')) {
                child.key = child.name;
              }
            });
          }
          // 设置自定义
          if (!el.systemFlag) {
            el.parentCode = ele.fieldCode;
          }
          // 设置 uuid
          el.fieldTemplateId = el.fieldTemplateId ? el.fieldTemplateId : -1;
          el.parentFieldTemplateId = ele.fieldTemplateId;
          // data.push(el)
        });
      });

      // data.forEach(function(ele,index){
      //   if (ele.hasOwnProperty('children')) {
      //     delete ele.children;
      //   }
      // })
      if (allLengthData.length >40) {
        that.$message.error({
          duration: 1000,
          message: '最多设置 40 个字段'
        });
        return false;
      }
      // console.log(JSON.stringify(data))
      if (opt === 'save') {
        that.saveAllData(data);
      } else {
        that.postPreview(data);
      }
    },500),

    /**
     *  保存---api
     */
    saveAllData(data) {
      const that = this;
      let para = {
        templateContent: JSON.stringify(data)
      };
      postRequest('/haoban-manage-web/record/record-template-save.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
            that.changeRoute('/fileSet');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     *  预览---api
     */
    postPreview(data) {
      const that = this;
      let para = {
        templateContent: JSON.stringify(data)
      };
      postRequest('/haoban-manage-web/record/record-template-preview.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // 生成二维码需要的 url
            let webUrl = `${window.location.origin}/office-mobile/#/staffRecordsTemplate?enterpriseId=${resData.result}`;
            that.$refs.qrcodePreview.qrcode(webUrl,'record');
            that.dialogVisible = true;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     *  关闭预览窗口
     */
    closeDialog() {
      const that = this;
      that.dialogVisible = false;
    },

    /**
     *  获取所有字段
     */
    getAllFields() {
      const that = this;
      postRequest('/haoban-manage-web/record/employee-find-system-template.json', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.handleAllFields(resData.result);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     *  处理所有系统模板信息
     */
    handleAllFields(result) {
      const that = this;
      result.forEach(function(ele, index) {
        if (!!that.hasOwnProperty(ele.parentCode)) {
          ele.fixed = parseInt(ele.fixed) === 1 ? true : false;
          ele.isMust = parseInt(ele.isMust) === 1 ? true : false;
          ele.systemFlag = true;
          ele.fieldOperations = !!ele.fieldOperations ? JSON.parse(ele.fieldOperations) : {};
          ele.staffRecordsIds = !!ele.staffRecordsIds ? JSON.parse(ele.staffRecordsIds) : [];
          that[ele.parentCode].push(ele);
        }
        // 设置 fieldParent
        if (!!that.fieldParent.hasOwnProperty(ele.fieldCode)) {
          ele.children = [];
          that.fieldParent[ele.fieldCode] = ele;
          ele.systemFlag = true;
        }
      });
    },

    /**
     *  获取已经保存模板信息---api
     */
    getInfo() {
      const that = this;
      postRequest('/haoban-manage-web/record/employee-find-template.json', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.setList = [];
            if (!!resData.result && !!resData.result.length) {
              that.handleGetInfo(resData.result);
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 简单数组-->父子数组对象
     */
    treeData(data) {
      let tree = data.filter(father => {
        //循环所有项
        let branchArr = data.filter(child => {
          return father.fieldCode == child.parentCode; //返回每一项的子级数组
        });
        if (branchArr.length > 0) {
          father.children = branchArr; //如果存在子级，则给父级添加一个children属性，并赋值
        }else{
          father.children = [];
        }
        return father.parentCode == 0; //返回第一层
      });
      // 排序
      tree.sort(function(a, b) {
        return a.sort - b.sort;
      });
      tree.forEach(function(ele, index) {
        if (!!ele.children && !!ele.children.length) {
          ele.children.sort(function(a, b) {
            return a.sort - b.sort;
          });
        }
      });
      return tree;
    },

    /**
     * 处理已存配置信息
     */
    handleGetInfo(result) {
      const that = this;
      let data = JSON.parse(JSON.stringify(result));
      that.setParent = [];
      data.forEach(function(ele, index) {
        ele.fixed = Number.parseInt(ele.fixed) === 1 ? true : false;
        ele.isMust = Number.parseInt(ele.isMust) === 1 ? true : false;
        ele.systemFlag = Number.parseInt(ele.systemFlag) === 1 ? true : false;
        ele.fieldOperations = !!ele.fieldOperations ? JSON.parse(ele.fieldOperations) : {};
        ele.staffRecordsIds = !!ele.staffRecordsIds ? JSON.parse(ele.staffRecordsIds) : [];
        // 设置禁止拖拽
        if (!!ele.systemFlag && ele.parentCode == 0) {
          that.setParent.push(ele.fieldCode);
        }
        if (!!ele.systemFlag && ele.parentCode != 0) {
          that.setList.push(ele.fieldCode);
        }
      });
      // console.log(JSON.stringify(that.treeData(data)));
      that.tempaletDataList = that.treeData(data);
      setTimeout(function() {
        that.setFixed();
      }, 100);
    },

    /**
     * 设置禁止拖拽
     */
    setFixed() {
      const that = this;
      // console.log("that.setParent:",that.setParent,that.setList)
      that.setParent.forEach(function(ele, index) {
        that[ele].forEach(function(obj, key) {
          if (that.setList.includes(obj.fieldCode)) {
            obj.fixed = true;
          }
        });
      });
    }
  },
  watch: {
    isDragging(newValue) {
      const that = this;
      if (newValue) {
        that.delayedDragging = true;
        return;
      }
      that.$nextTick(() => {
        that.delayedDragging = false;
      });
    }
  },
  components: {
    draggable,
    AddInput,
    limitInput,
    qrcodeDialog
  },
  mounted() {
    const that = this;
    // 获取已经配置的数据
    // that.getInfo()
    Promise.all([that.getAllFields(), that.getInfo()]);
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  }
};
</script>
<style type="text/less" lang="less" scoped>
.template-wrap {
  width: 100%;
  /*height: 100%;*/
  min-height: 860px;
  padding: 0;
  margin: 0;
  background: url('../../assets/template-bg.jpg') no-repeat center center;
  background-size: 100% 100%;

  .b-t-1 {
    border-top: 1px solid #e4e7ed;
  }

  .template-contain {
    width: 1200px;
    margin: 0 auto;
  }

  .qr-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }

  .qr-dialog {
    position: fixed;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #fff;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;

    .qr-dialog__hd {
      position: relative;
      .qr-dialog__title {
        display: block;
        padding: 32px 0;
        font-size: 18px;
        color: #303133;
      }

      i {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 46px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        font-size: 10px;
        color: #9b9da3;
        cursor: pointer;
      }
    }

    .qr-dialog__bd {
      padding: 0 1.6em 0.8em;
      min-height: 40px;
      font-size: 15px;
      line-height: 1.3;
      word-wrap: break-word;
      word-break: break-all;
      color: #808080;

      #qrcode {
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .qr-dialog__p {
        padding: 20px 0;
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .template-head {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;

    .flex-1 {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
    }

    .flex-r {
      justify-content: flex-end;
    }

    .template-title-span {
      color: #fff;
      font-size: 30px;
      padding-left: 18px;
    }

    .el-button--default.is-plain {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      &:hover {
        color: #fff;
        background: #1890ff;
      }
    }
    .el-button--primary.is-plain {
      background: transparent;
      border-color: #1890ff;
      &:hover {
        background: #1890ff;
      }
    }
  }

  .template-body {
    width: 100%;
    position: relative;
    overflow: hidden;

    .el-tab-pane {
      height: 660px;
      overflow-y: scroll;
    }

    /* 左侧 */
    .template-cell-l {
      width: 350px;
      float: left;
      height: 740px;
      padding-top: 40px;

      .el-tabs {
        /deep/ .el-tabs__item {
          width: 50%;
          width: 175px;
          /*padding: 0;*/
          color: rgba(255, 255, 255, 0.5);
          &.is-active {
            color: #1890ff;
          }
        }
      }

      .compenent-item {
        position: relative;
        width: 148px;
        height: 42px;
        margin: 0 15px 15px 0;
        line-height: 40px;
        padding: 0 10px;
        display: inline-block;
        text-align: center;
        cursor: move;
        color: #fff;
        padding: 0;
        overflow: hidden;
        font-size: 12px;
        border: 1px dashed rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
        &.fixed-item {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      #list5 {
        .compenent-item {
          text-align: left;
          padding: 0 16px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          overflow: hidden;
          span,
          .bg-icon {
            display: inline-block;
            vertical-align: middle;
          }
          .bg-icon {
            position: absolute;
            top: 50%;
            right: 16px;
            -webkit-transform: translate(0, -50%);
            -ms-transform: translate(0, -50%);
            -o-transform: translate(0, -50%);
            transform: translate(0, -50%);
            width: 17px;
            height: 17px;
            background: url('../../assets/icon-template.png') no-repeat center center;
            background-size: 35px;
            &.bg-icon-one {
              background-position: 0 -16px;
            }
            &.bg-icon-two {
              background-position: 0 0;
            }
            &.bg-icon-three {
              background-position: 0 -50px;
            }
            &.bg-icon-four {
              background-position: 0 -180px;
            }
            &.bg-icon-five {
              background-position: 0 -66.5px;
            }
            &.bg-icon-six {
              background-position: 0 -83px;
            }
            &.bg-icon-seven {
              background-position: 0 -33px;
            }
            &.bg-icon-eight {
              background-position: 0 -98px;
            }
          }
          &:hover {
            color: #1890ff;
            border-color: #1890ff;
            .bg-icon {
              &.bg-icon-one {
                background-position: -18px -16px;
              }
              &.bg-icon-two {
                background-position: -18px 0;
              }
              &.bg-icon-three {
                background-position: -18px -50px;
              }
              &.bg-icon-four {
                background-position: -18px -180px;
              }
              &.bg-icon-five {
                background-position: -18px -66px;
              }
              &.bg-icon-six {
                background-position: -18px -83px;
              }
              &.bg-icon-seven {
                background-position: -18px -33px;
              }
              &.bg-icon-eight {
                background-position: -18px -98px;
              }
            }
          }
        }
      }
      .filed-item-title {
        padding: 15px 0;
        font-size: 14px;
        color: #ffffff;
      }
    }
    /* 中间 */
    /* 模板 */
    .template-cell-m {
      float: left;
      width: 410px;
      height: 740px;
      margin: 0 20px;
      position: relative;

      .view-content {
        position: relative;
      }

      .templet-null-img {
        width: 249px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
    }

    .drag-wrap {
      min-height: 530px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .phone-container {
      margin-top: 40px;
    }
    .phone-view {
      background: url(../../assets/iphone.png) no-repeat;
      background-size: 100%;
      width: 410px;
      height: 740px;
      /*margin: 0 20px;*/
      position: relative;
    }

    .phone-show-content {
      width: 330px;
      height: 537px;
      position: absolute;
      left: 41px;
      top: 83px;
      overflow-y: auto;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
      font-size: 14px;
      position: relative;

      &.sex::after {
        content: '';
        width: 100%;
        height: 100%;
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }

    .opend-card-group-title {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
    }

    .phone-list-item {
      height: 44px;
      line-height: 44px;
      background: #fff;
      margin-bottom: 5px;
    }

    .item-title {
      width: 100px;
      float: left;
      padding-left: 10px;
    }

    .filed-item {
      background: #fff;
      height: 46px;
      width: 100%;
      height: auto;
      background: #fff;
      position: relative;
      cursor: move;
      padding: 0px;
      margin: 0;
      font-size: 12px;
      color: #292929;

      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &.active-item {
        border: 1px solid #1890ff;
      }

      & + .filed-item {
        margin-top: 5px;

        &.li-block {
          margin-top: 15px;
        }
      }
      /*删除*/
      .item-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: #1890ff;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: none;
        z-index: 2;
      }
      &:hover {
        border: 1px dashed #1890ff;
        .p-item-close {
          display: block;
        }
      }

      &.child-filed-item {
        &:hover {
          .child-item-close {
            display: block;
          }
        }
      }
    }
    /* 组块 */
    .block {
      min-height: 308px;
      background: #f0eff4;

      .block-head {
        width: 100%;
        background: #f5f5f8;
        padding: 0;
        height: 35px;

        .opencard-item-title {
          height: 35px;
          line-height: 35px;
          /* &.block-pre-wrap{
            line-height: 12px;
            word-break: break-all;
            white-space: pre-wrap;
            padding-top: 7px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }*/
        }
      }
      .drag-wrap {
        min-height: 250px;
      }
    }

    .opencard-drag {
      background: #fff;
      height: 46px;
    }

    .opencard-item-title {
      width: 90px;
      height: 46px;
      line-height: 46px;
      text-align: left;
      float: left;
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 14px;
      &.title-pre-wrap {
        line-height: 15px;
        word-break: break-all;
        white-space: pre-wrap;
        padding-top: 9px;
      }
      /*&.block-pre-wrap{
        line-height: 12px;
        word-break: break-all;
        white-space: pre-wrap;
        padding-top: 9px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }*/
    }

    .show-warm-text {
      color: #c0c4cc;
      width: 185px;
      text-align: left;
      display: inline-block;
      white-space: nowrap;
      height: 46px;
      line-height: 46px;
      font-size: 14px;

      .el-icon-arrow-right {
        font-size: 20px;
        vertical-align: middle;
      }

      .iconfont.icon-icon {
        font-size: 20px;
        color: #808995;
      }

      &.select-flag {
        width: 225px;
        text-align: right;
      }
    }

    .limit-w-340 {
      /deep/ .el-input__inner {
        font-size: 12px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .tip {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    /* 右侧 */
    .template-cell-r {
      width: 400px;
      float: left;
      overflow: hidden;
      padding-top: 40px;

      .input-line-cell {
        .tip {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .limit-w-340 {
        /deep/ .el-input__inner {
          font-size: 12px;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .tip {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .el-tabs {
        /deep/.el-tabs__item {
          width: 175px;
          /* padding: 0; */
          /*color: rgba(255, 255, 255, 0.5);*/
        }

        /deep/.el-tabs__nav-wrap::after {
          content: none;
        }
      }

      .label-txt {
        margin: 0 10px;
        font-size: 14px;
        color: #fff;
      }

      .margin-t-15 {
        margin-top: 15px;
      }

      .margin-t-30 {
        margin-top: 30px;
      }

      .margin-l-15 {
        margin-left: 15px;
      }

      .margin-b-15 {
        margin-bottom: 15px;
      }

      .w-60 {
        width: 60px;
      }

      .w-120 {
        width: 120px;
      }

      .w-316 {
        width: 316px;
      }

      .limit-w-340 {
        /deep/ .el-input__inner {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .opt-btn {
        cursor: pointer;
        color: #c9d3df;
        vertical-align: middle;

        &.add-item:hover {
          /*color: #1890ff;*/
        }
        &.del-item:hover {
          /*color: #F56C6C;*/
        }
      }

      .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .flex-wrap {
        -webkit-flex-wrap: wrap;
        -moz-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        -o-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .staffRecords-limit {
        .flex();
        .flex-wrap();

        .label-cell {
          min-width: 50%;
          max-width: 50%;
          margin-left: 0;
        }
      }

      .label-cell {
        margin-bottom: 15px;
        color: #fff;
      }

      .el-checkbox {
        /deep/ span.el-checkbox__label {
          color: #fff;
        }
        &.is-disabled {
          /deep/ span.el-checkbox__label {
            color: #fff;
          }
        }
      }

      .el-radio {
        /deep/ span.el-radio__label {
          color: #fff;
        }
        &.is-disabled {
          /deep/ span.el-radio__label {
            color: #fff;
          }
        }
      }

      .el-input {
        /deep/ .el-input__inner {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .is-disabled {
          /deep/ .el-input__inner {
            color: #fff;
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }

      .el-checkbox {
        color: #fff;
      }

      .edit-view {
        /*height: 700px;*/
        /*overflow-y: auto;*/
        /*margin-top:40px;*/
      }

      .edit-item {
        color: #fff;
        padding-bottom: 10px;

        .tip {
          margin-left: -40px;
          color: rgba(255, 255, 255, 0.7);
          width: 30px;
          display: inline-block;
          text-align: right;
          margin-right: 10px;
          font-size: 12px;
        }
      }

      .edit-item-title {
        color: #ffffff;
        font-size: 14px;
        font-weight: normal;
        padding: 20px 0;

        &.edit-title-padding {
          padding-top: 15px;
        }
      }

      .edit-item-title span {
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>
