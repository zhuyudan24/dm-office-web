<template>
  <div class="template-wrap" :style="{ height: bodyHeight }">
    <div class="template-contain">
      <!-- 头部标题 -->
      <div class="template-head">
        <div class="template-title flex-1">
          <img src="../../../assets/logo45_45.png" alt="logo" />
          <span class="template-title-span">日报设置</span>
        </div>
        <div class="template-btns flex-1 flex-r">
          <el-button type="primary" plain @click="saveAndBack('preview')">预 览</el-button>
          <el-button type="primary" plain @click="returnBack">返 回</el-button>
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
              <div class="filed-item-title">交易</div>
              <ul>
                <draggable id="list1" :list="tradeInfo" class="compenent" :options="leftOption" :clone="cloneItem" :move="onMove" @start="isDragging = true" @end="itemMoveEnd"
                  ><!-- @end="itemMoveEnd" -->
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in tradeInfo" :key="index" aria-hidden="true">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">人员</div>
              <ul>
                <draggable id="list2" :list="personInfo" class="compenent" :options="leftOption" :clone="cloneItem" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in personInfo" :key="index">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">商品</div>
              <ul>
                <draggable id="list3" :list="goodsInfo" class="compenent" :options="leftOption" :clone="cloneItem" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in goodsInfo" :key="index">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">竞品</div>
              <ul>
                <draggable id="list4" :list="competeInfo" class="compenent" :options="leftOption" :clone="cloneItem" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in competeInfo" :key="index">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="自定义字段" name="second">
              <div class="filed-item-title"><!-- 其他信息 --></div>
              <ul>
                <draggable id="list5" :list="defineInfo" class="compenent" :options="leftDefineOption" :clone="cloneItem" :move="onChildMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '', item.type == 11 ? 'block-class' : '']" :data-type="item.fieldCode" v-for="(item, index) in defineInfo" :key="index">
                    <span v-if="item.type == 0">{{ item.title }}</span>
                    <span v-if="item.type == 1">{{ item.title }}</span>
                    <span v-if="item.type == 2">{{ item.title }}</span>
                    <span v-if="item.type == 3">{{ item.title }}</span>
                    <span v-if="item.type == 4">{{ item.title }}</span>
                    <span v-if="item.type == 5">{{ item.title }}</span>
                    <span v-if="item.type == 6">{{ item.title }}</span>
                    <span v-if="item.type == 7">{{ item.title }}</span>
                    <span v-if="item.type == 9">{{ item.title }}</span>
                    <span v-if="item.type == 10">{{ item.title }}</span>
                    <span v-if="item.type == 11">{{ item.title }}</span>

                    <i v-if="item.type == 0" class="bg-icon bg-icon-one"></i>
                    <i v-if="item.type == 1" class="bg-icon bg-icon-two"></i>
                    <i v-if="item.type == 2" class="bg-icon bg-icon-three"></i>
                    <i v-if="item.type == 3" class="bg-icon bg-icon-four"></i>
                    <i v-if="item.type == 4" class="bg-icon bg-icon-five"></i>
                    <i v-if="item.type == 5" class="bg-icon bg-icon-six"></i>
                    <i v-if="item.type == 6" class="bg-icon bg-icon-seven"></i>
                    <i v-if="item.type == 7" class="bg-icon bg-icon-eight"></i>
                    <i v-if="item.type == 9" class="bg-icon bg-icon-ten"></i>
                    <i v-if="item.type == 10" class="bg-icon bg-icon-eleven"></i>
                    <i v-if="item.type == 11" class="bg-icon bg-icon-twelve"></i>
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
                      <img class="templet-null-img" src="../../../assets/templet_null_img.png" />
                    </template>
                    <draggable :options="{ group: { name: 'people', pull: false, put: true }, sort: true }" v-model="tempaletDataList" class="drag-wrap">
                      <li :class="['filed-item', currentIndex == index ? 'active-item' : '', 'li-block']" v-for="(item, index) in tempaletDataList" :key="'li1' + index" @click="selectItem(item.fieldCode, index)">
                        <!-- 删除 -->
                        <span v-if="item.fieldCode != 'baseInfo'" class="item-close p-item-close" @click.stop="deleteItem(item.name, item.parentCode, index, item)">
                          <i class="el-icon-close"></i>
                        </span>
                        <div v-if="!!item.systemFlag || !item.name.includes('groupc')">
                          <!-- 输入 -->
                          <input-com v-if="item.type == 1 || item.type == 2 || item.type == 3 || item.type == 10 || item.type == 9" :childItem="item"></input-com>
                          <!-- 选择 -->
                          <select-com v-if="item.type == 4 || item.type == 5" :childItem="item"></select-com>
                          <!-- 日期区间 -->
                          <date-range-com v-if="item.type == 6" :childItem="item"></date-range-com>
                          <!-- 图片 -->
                          <image-com v-if="item.type == 7" :childItem="item"></image-com>
                          <!-- 业绩王/竞品品牌 组块的 -->
                          <block-com v-if="item.type == '11'" :childItem="item"></block-com>
                        </div>
                        <template>
                          <div class="block" v-if="item.name.includes('groupc')">
                            <div class="block-head">
                              <div :class="['opencard-item-title', getZhLen(item.title) >= 6 ? 'title-pre-wrap' : '']">{{ item.title }}</div>
                            </div>
                            <ul class="view-content">
                              <draggable :options="{ group: { name: 'people', pull: false, put: true }, sort: true }" v-model="item.children" :class="['drag-wrap', 'block-wrap', item.fieldCode]" @add="addDragItem">
                                <li :class="['filed-item', 'child-filed-item', currentChildKey == childItem.name && currentChildIndex == ind ? 'active-item' : '']" v-for="(childItem, ind) in item.children" :key="'li' + ind" @click.stop="selectChildItem(childItem.name, index, ind, item.children)">
                                  <!-- 删除 -->
                                  <span class="item-close child-item-close" @click.stop="deleteChildItem(childItem.name, index, ind, item.children, childItem)">
                                    <i class="el-icon-close"></i>
                                  </span>
                                  <!-- item -->
                                  <!-- 选择 -->
                                  <select-com v-if="childItem.type == 4 || childItem.type == 5" :childItem="childItem"></select-com>
                                  <!-- 日期区间 -->
                                  <date-range-com v-if="childItem.type == 6" :childItem="childItem"></date-range-com>
                                  <!-- 图片 -->
                                  <image-com v-if="childItem.type == 7" :childItem="childItem"></image-com>
                                  <!-- 单行/多行/数字输入框 -->
                                  <input-com v-if="childItem.type == 1 || childItem.type == 2 || childItem.type == 3 || childItem.type == 10 || childItem.type == 9" :childItem="childItem"></input-com>
                                  <!-- 业绩王/竞品品牌 组块的 -->
                                  <block-com v-if="childItem.type == '11' && !!childItem.systemFlag" :childItem="childItem"></block-com>
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
        <div class="template-cell template-cell-r define-template-tab">
          <el-tabs v-model="rightName">
            <el-tab-pane label="控件设置" name="first">
              <div id="edit-box">
                <div class="edit-view baby-info-flag baby-info">
                  <template v-for="(item, index) in tempaletDataList">
                    <!-- 标题 日期区间特殊-->
                    <template v-if="currentIndex == index && !item.systemFlag && item.type != 6">
                      <div class="edit-item test-title limit-w-340" :key="'child' + index">
                        <div class="edit-item-title">标题</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.title" :holder="''" :disflag="item.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                        <p v-if="item.type == 7" style="margin-top: 8px;font-size: 12px;color: rgba(255, 255, 255, 0.7)">
                          图片最多可添加9张
                        </p>
                      </div>
                    </template>
                    <!-- 日期区间 -->
                    <template v-if="currentIndex == index && !item.systemFlag && item.type == 6">
                      <div class="edit-item test-title limit-w-340" :key="'child62' + index">
                        <div class="edit-item-title">标题 最多10个字</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.startTitle" :holder="''" :disflag="item.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                      </div>
                      <div class="edit-item test-title limit-w-340" :key="'child64' + index">
                        <div class="edit-item-title">标题2 最多10个字</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.endTitle" :holder="''" :disflag="item.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                      </div>
                    </template>
                    <!-- 提示 组块 日期，图片没有-->
                    <template v-if="currentIndex == index && !item.systemFlag && (item.type != 11 && item.type != 5 && item.type != 7)">
                      <div class="edit-item test-title limit-w-340" :key="'child1' + index">
                        <div class="edit-item-title">提示文字最多20个字</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.placeholder" :holder="''" :disflag="false" :getByType="'char'" :maxLength="20"> </limitInput>
                        <p class="font-12 m-t-10" v-if="item.type == 2 || item.type == 9">内容最多输入500个字</p>
                        <p class="font-12 m-t-10" v-if="item.type == 1">内容最多输入100个字</p>
                      </div>
                    </template>
                    <!-- 单位 -->
                    <template v-if="currentIndex == index && !item.systemFlag && item.type == 3">
                      <div class="edit-item test-title limit-w-340" :key="'child11' + index">
                        <div class="edit-item-title">单位最多20个字</div>
                        <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="item.placeholder" :holder="''" :disflag="false" :getByType="'char'" :maxLength="20"> </limitInput>
                        <p class="font-12 m-t-10">内容最大限制为12位数</p>
                      </div>
                    </template>
                    <!-- 选项 -->
                    <template v-if="currentIndex == index && !item.systemFlag && item.type == '4'">
                      <div class="edit-item " :key="'child111' + index">
                        <div class="edit-item-title">选项 <span v-if="!item.systemFlag">最多20项，每项最多10个字</span></div>
                        <template v-for="(types, childItemInd) in item.list">
                          <div class="margin-t-15 limit-w-340" :style="childItemInd == 0 ? 'margin-top: 0' : ''" :key="'child10' + childItemInd">
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="types.value" :holder="''" :disflag="item.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                            <i class="opt-btn el-icon-remove del-item" v-if="!item.systemFlag && item.list.length > 1" @click="delChildItem(index, childItemInd, item)"></i>
                            <template v-if="!item.systemFlag && childItemInd < 19">
                              <i class="opt-btn el-icon-circle-plus add-item" v-if="childItemInd == item.list.length - 1" @click="addChildItem(index, childItemInd, item)"></i>
                            </template>
                          </div>
                        </template>
                      </div>
                      <div class="edit-item m-b-10" :key="'parent22' + index">
                        <div class="edit-item-title edit-title-padding">选择框类型</div>
                        <div>
                          <el-radio v-model="item.chooseType" :label="0">单选</el-radio>
                          <el-radio v-model="item.chooseType" :label="1">多选</el-radio>
                        </div>
                      </div>
                    </template>
                    <!-- 日期 -->
                    <template v-if="currentIndex == index && !item.systemFlag && (item.type == 5 || item.type == 6)">
                      <div class="edit-item " :key="'child117' + index">
                        <div class="edit-item-title">日期类型</div>
                        <el-radio v-model="item.dateType" :label="1">
                          年-月-日 时 分
                        </el-radio>
                        <el-radio v-model="item.dateType" :label="0">
                          年-月-日
                        </el-radio>
                      </div>
                    </template>
                    <!-- 大写 -->
                    <template v-if="currentIndex == index && !item.systemFlag && item.type == 10">
                      <div class="edit-item m-b-10" :key="'parent210' + index">
                        <div class="edit-item-title edit-title-padding">大写</div>
                        <el-checkbox v-model="item.openCapitalize">显示大写</el-checkbox>
                      </div>
                    </template>
                    <!-- 验证 组块没有-->
                    <template v-if="currentIndex == index && !item.name.includes('groupc')">
                      <div class="edit-item m-b-10" :key="'parent2' + index">
                        <div class="edit-item-title edit-title-padding">验证</div>
                        <el-checkbox v-model="item.isMust" @change="changeMust($event, !!item.list, item)">必填</el-checkbox>
                      </div>
                    </template>
                    <!-- 验证 是否必填 组块没有-->
                    <template v-if="currentIndex == index && (item.name == 'performanceKing' || item.name == 'competitorInfo')">
                      <div class="edit-item m-b-10" :key="'parent21' + index">
                        <div class="edit-item-title edit-title-padding">验证 是否必填</div>
                        <div class="must-list">
                          <div class="must-list-cell m-b-10" v-for="(listItem, listIndex) in item.list" :key="'list' + listIndex">
                            <el-checkbox v-model="listItem.isMust">{{ listItem.title }}</el-checkbox>
                          </div>
                        </div>
                      </div>
                    </template>
                    <!-- 记忆 组块没有-->
                    <template v-if="currentIndex == index && !item.name.includes('groupc')">
                      <div class="edit-item " :key="'parent3' + index">
                        <div class="edit-item-title edit-title-padding">记忆</div>
                        <el-checkbox v-model="item.memory">是否记忆</el-checkbox>
                      </div>
                    </template>
                    <!-- 组块内部 -->
                    <template v-if="childIndex == index && !!item.children && !!item.children.length">
                      <template v-for="(childItem, ind) in item.children">
                        <!-- 标题 日期区间例外-->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && childItem.type != 6">
                          <div class="edit-item test-title limit-w-340" :key="'child' + ind">
                            <div class="edit-item-title">标题</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.title" :holder="''" :disflag="childItem.systemFlag" :getByType="'word'" :maxLength="10"> </limitInput>
                            <p v-if="childItem.type == 7" style="margin-top: 8px;font-size: 12px;color: rgba(255, 255, 255, 0.7)">
                              图片最多可添加9张
                            </p>
                          </div>
                        </template>
                        <!-- 日期区间 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && childItem.type == 6">
                          <div class="edit-item test-title limit-w-340" :key="'child2' + ind">
                            <div class="edit-item-title">标题 最多10个字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.startTitle" :holder="''" :disflag="childItem.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                          </div>
                          <div class="edit-item test-title limit-w-340" :key="'child4' + ind">
                            <div class="edit-item-title">标题2 最多10个字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.endTitle" :holder="''" :disflag="childItem.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                          </div>
                        </template>
                        <!-- 提示 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && !(childItem.type == 5 || childItem.type == 7)">
                          <div class="edit-item test-title limit-w-340" :key="'child1' + ind">
                            <div class="edit-item-title">提示文字最多20个字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.placeholder" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                            <p class="font-12 m-t-10" v-if="childItem.type == 2 || childItem.type == 9">内容最多输入500个字</p>
                            <p class="font-12 m-t-10" v-if="childItem.type == 1">内容最多输入100个字</p>
                          </div>
                        </template>

                        <!-- 单位 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && childItem.type == 3">
                          <div class="edit-item test-title limit-w-340" :key="'child6' + ind">
                            <div class="edit-item-title">单位最多20个字</div>
                            <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="childItem.unit" :holder="''" :disflag="false" :getByType="'word'" :maxLength="20"> </limitInput>
                            <p class="font-12 m-t-10">内容最大限制为12位数</p>
                          </div>
                        </template>
                        <!-- 日期 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && (childItem.type == 5 || childItem.type == 6)">
                          <div class="edit-item " :key="'child7' + ind">
                            <div class="edit-item-title">日期类型</div>
                            <el-radio v-model="childItem.dateType" :label="1">
                              年-月-日 时 分
                            </el-radio>
                            <el-radio v-model="childItem.dateType" :label="0">
                              年-月-日
                            </el-radio>
                          </div>
                        </template>
                        <!-- 选项 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && childItem.type == '4'">
                          <div class="edit-item " :key="'child9' + ind">
                            <div class="edit-item-title">选项 <span v-if="!childItem.systemFlag">最多20项，每项最多10个字</span></div>
                            <template v-for="(types, childItemInd) in childItem.list">
                              <div class="margin-t-15 limit-w-340" :style="childItemInd == 0 ? 'margin-top: 0' : ''" :key="'child10' + childItemInd">
                                <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="types.value" :holder="''" :disflag="childItem.systemFlag" :getByType="'char'" :maxLength="10"> </limitInput>
                                <i class="opt-btn el-icon-remove del-item" v-if="!childItem.systemFlag && childItem.list.length > 1" @click="delChildItem(index, childItemInd, childItem)"></i>
                                <template v-if="!childItem.systemFlag && childItemInd < 19">
                                  <i class="opt-btn el-icon-circle-plus add-item" v-if="childItemInd == childItem.list.length - 1" @click="addChildItem(index, childItemInd, childItem)"></i>
                                </template>
                              </div>
                            </template>
                          </div>
                          <div class="edit-item m-b-10" :key="'child922' + ind">
                            <div class="edit-item-title edit-title-padding">选择框类型</div>
                            <div>
                              <el-radio v-model="childItem.chooseType" :label="0">单选</el-radio>
                              <el-radio v-model="childItem.chooseType" :label="1">多选</el-radio>
                            </div>
                          </div>
                        </template>
                        <!-- 大写 -->
                        <template v-if="currentChildIndex == ind && !childItem.systemFlag && childItem.type == 10">
                          <div class="edit-item m-b-10" :key="'child910' + ind">
                            <div class="edit-item-title edit-title-padding">大写</div>
                            <el-checkbox v-model="childItem.openCapitalize">显示大写</el-checkbox>
                          </div>
                        </template>
                        <!-- 必填 -->
                        <template v-if="currentChildIndex == ind">
                          <div class="edit-item" :key="'child11' + ind">
                            <div class="edit-item-title">验证</div>
                            <el-checkbox v-model="childItem.isMust" @change="changeMust($event, !!childItem.list, childItem)">必填</el-checkbox>
                          </div>
                        </template>
                        <!-- 验证 是否必填 组块没有-->
                        <template v-if="currentChildIndex == ind && (childItem.name == 'performanceKing' || childItem.name == 'competitorInfo')">
                          <div class="edit-item m-b-10" :key="'child111' + ind">
                            <div class="edit-item-title edit-title-padding">验证 是否必填</div>
                            <div class="must-list">
                              <div class="must-list-cell m-b-10" v-for="(listItem, listIndex) in childItem.list" :key="'list111' + listIndex">
                                <el-checkbox v-model="listItem.isMust">{{ listItem.title }}</el-checkbox>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="currentChildIndex == ind">
                          <div class="edit-item " :key="'child12' + ind">
                            <div class="edit-item-title edit-title-padding">记忆</div>
                            <el-checkbox v-model="childItem.memory">是否记忆</el-checkbox>
                          </div>
                        </template>
                      </template>
                    </template>
                    <!-- 组块内部 -->
                  </template>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="模板设置" name="second">
              <div class="template-item limit-w-340">
                <div class="edit-item-title edit-title-padding">模板名称 最多10个字</div>
                <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="templateObj.title" :holder="''" :disflag="false" :getByType="'char'" :maxLength="10"> </limitInput>
              </div>
              <div class="template-item limit-w-340">
                <div class="edit-item-title edit-title-padding">模板描述 最多20个字</div>
                <limitInput :inputWidth="340" :limitClass="'limit-color'" :inputValue.sync="templateObj.description" :holder="''" :disflag="false" :getByType="'char'" :maxLength="20"> </limitInput>
              </div>
              <div class="template-item ">
                <div class="edit-item-title edit-title-padding">门店类型</div>
                <div class="store-type-list">
                  <div class="store-type-cell m-b-20" v-for="(item, index) in storeList" :key="item.name + index">
                    <el-radio v-model="templateObj.storeType" :label="item.id" :disabled="item.disabled">{{ item.name }}</el-radio>
                  </div>
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
import imageCom from './template/image.vue';
import selectCom from './template/select.vue';
import dateRangeCom from './template/date-range.vue';
import inputCom from './template/input.vue';
import blockCom from './template/block.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
// import strLength from '@/common/js/strlen';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'customSetTemplate',
  data() {
    return {
      // tab
      activeName: 'first',
      // right tab
      rightName: 'second',
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
      templateId: '', // 模板 id
      oparateType: '', // 编辑： edit；复制: copy
      counter: 1, // 计数器
      // rightOption
      selectKey: '',
      // 交易信息
      tradeInfo: [],
      // 人员信息
      personInfo: [],
      // 商品信息
      goodsInfo: [],
      // 竞品信息
      competeInfo: [],
      // 自定义
      defineInfo: [],
      // 中间数据集合
      currentIndex: 0, //当前选择的 item
      // children
      currentChildKey: null,
      currentChildIndex: null,
      childIndex: 0,
      tempaletDataList: [], // 中间数据集合
      // 已经选择的字段集合
      setList: [],
      // 模板数据
      templateObj: {
        title: '',
        description: '',
        storeType: '',
        momory: []
      },
      storeList: [
        {
          id: '0',
          name: '自营门店',
          disabled: false
        },
        {
          id: '1',
          name: '联营门店',
          disabled: false
        },
        {
          id: '2',
          name: '代理门店',
          disabled: false
        },
        {
          id: '3',
          name: '代销门店',
          disabled: false
        },
        {
          id: '4',
          name: '托管门店',
          disabled: false
        }
      ]
    };
  },
  methods: {
    getZhLen: function(val) {
      let len = 0;
      for (let i = 0; i < val.length; i++) {
        let a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 1;
        } else {
          len += 0.5;
        }
      }
      return Math.ceil(len);
    },
    /**
     *  返回
     */
    returnBack() {
      let that = this;
      that.changeRoute(`/customReport?brandId=${that.brandId}&appIcon=${that.$route.query.appIcon}`);
    },

    cloneItem(original) {
      let that = this;
      let originalCopy = JSON.parse(JSON.stringify(original));
      originalCopy.cid = `c${that.counter}`;
      if (!originalCopy.systemFlag) {
        if (originalCopy.name.includes('textc')) {
          originalCopy.name = `textc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('paragraphc')) {
          originalCopy.name = `paragraphc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('numberc')) {
          originalCopy.name = `numberc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('checkboxesOrRadioc')) {
          originalCopy.name = `checkboxesOrRadioc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('datec')) {
          originalCopy.name = `datec${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('dateareac')) {
          originalCopy.name = `dateareac${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('picc')) {
          originalCopy.name = `picc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('introductionc')) {
          originalCopy.name = `introductionc${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('pricec')) {
          originalCopy.name = `pricec${that.counter}`;
          // originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
        if (originalCopy.name.includes('groupc')) {
          originalCopy.name = `groupc${that.counter}`;
          originalCopy.title = `${originalCopy.title}${that.counter}`;
        }
      }
      return originalCopy;
    },
    /**
     *  move{relatedContext, draggedContext}
     */
    onMove(evt) {
      let that = this;
      // 检查
      const draggedElement = evt.draggedContext.element;
      let names = that.tempaletDataList.map(ele => ele.name);
      if (names.includes(draggedElement.name)) {
        return false;
      }
      return !draggedElement.fixed;
    },
    /**
     *  move child
     */
    onChildMove(evt) {
      let tag = true;
      // 组块 特殊处理
      if (evt.dragged.className.indexOf('block-class') != -1) {
        if (evt.to.className.indexOf('block-wrap') != -1) {
          tag = false;
        }
      }
      return tag;
    },
    /**
     *  move end
     */
    itemMoveEnd(evt) {
      let that = this;
      that.isDragging = false;
      that.selectKey = '';
      that.selectKey = evt.clone.dataset.name;
      // 判断中间是否已经添加
      that.tempaletDataList.forEach(function(ele, index) {
        if (ele.name == that.selectKey) {
          setKey(ele.parentCode);
        }
        if (!!ele.children) {
          ele.children.forEach(function(child, key) {
            if (child.name == that.selectKey) {
              setKey(child.parentCode);
            }
          });
        }
      });
      /* eslint-disable */
      function setKey(parentCode) {
        /* eslint-disable */
        that[parentCode].forEach(function(ele, index) {
          /* eslint-disable */
          if (ele.name == that.selectKey) {
            ele.fixed = true;
          }
        });
      }
      that.selectKey = '';
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      that.$forceUpdate();
      that.counter = that.counter + 1;
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
    deleteItem(key, pCode, index, item) {
      let that = this;
      that.tempaletDataList.splice(index, 1);
      that.currentIndex--;
      if (that.currentIndex <= 0) {
        that.currentIndex = 0;
      }
      // 如果是自定义的判断是不是组块
      if (!item.systemFlag) {
        if (item.name.includes('groupc') && !!item.children.length) {
          // 设置系统的可选择
          item.children.forEach(ele => {
            if (!!ele.systemFlag) {
              that[ele.parentCode].forEach(el =>{
                 if (el.name == ele.name) {
                    el.fixed = false;
                  }
              })
            }
          })
        }
        return false;
      }else {
        // 删除后重新设置 fixed 值
        that[pCode].forEach(function(ele, index) {
          if (ele.name == key) {
            ele.fixed = false;
          }
        });
      }
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
      that.currentChildKey = that.tempaletDataList[index].children[ind].name;
      that.currentChildIndex--;
      if (that.currentChildIndex <= 0) {
        that.currentChildIndex = 0;
      }
      // list.splice(ind,1)
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      that.tempaletDataList[index].children.splice(ind, 1);

      // 重新设置左侧的 fixed
      if (!childItem.systemFlag) {
        return false;
      }
      that[childItem.parentCode].forEach(function(ele, index) {
        if (ele.name === key) {
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
      item.list.splice(ind, 1);
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
        item.list.push({ value: "选项"+(ind+2), key: (ind+2) });
        // 判断重复字段
        let arrValues = item.list.map(item => item.value); // 返回对象中键值集合的数组
        if (that.isRepeat(arrValues)) {
          item.list.splice(item.list.length - 1, 1);
          arrValues.splice(item.list.length - 1, 1);
          that.$message.error({
            duration: 1000,
            message: '选项不能重复'
          });
        }
      }
    },

    /**
     *  验证必填（有 list 时候）
     */
    changeMust(e, flag, item) {
      let that = this;
      if (!!flag) {
        item.list.forEach(ele => {
          if (!!e) {
            ele.isMust = true;
          }else {
             ele.isMust = false;
          }
        })
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
      let that = this;
      let tag = {};
      tag.filedFlag = true;
      tag.filedRepeat = false;
      let filedArr = [];
      data.forEach(function(ele) {
        if (ele.title == '') {
          tag.filedFlag = false;
          tag.name = ele.title || '';
          return false;
        }
        filedArr.push(ele.title);
        // 判断子级
        if ( ele.hasOwnProperty('children') && !!ele.children.length) {
          ele.children.forEach(function(el) {
            if (!!el.systemFlag && el.title == '') {
              tag.filedFlag = false;
              tag.name = el.title || '';
              return false;
            }
            filedArr.push(el.title);
          });
        }
      });
      // 判断重复 title
      if (that.isRepeat(filedArr)) {
        tag.filedRepeat = true;
      }
      return tag;
    },

    /**
     * 检查模板的数据
     *
     */
    checkTemplateObj() {
      let that = this;
      let flag = true;
      if (!that.templateObj.title || !that.templateObj.description || !that.templateObj.storeType) {
        flag = false
      }
      return flag;
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
    saveAndBack: _debounce(function(opt) {
      const that = this;
      if (!that.checkTemplateObj()) {
        that.$message.error({
          duration: 1000,
          message: '请完善模板设置内容'
        });
        return false;
      }
      let data = JSON.parse(JSON.stringify(that.tempaletDataList));
      let tagObj = that.checkTag(data);
      // 检查空字段
      if (!tagObj.filedFlag) {
        that.$message.error({
          duration: 1000,
          message: tagObj.name + '字段标题不能为空'
        });
        return false;
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
        ele.isMust = !!ele.isMust? 1 : 0;
        ele.memory = !!ele.memory? 1 : 0;
        if (ele.hasOwnProperty('openCapitalize')) {
          ele.openCapitalize = !!ele.openCapitalize ? 1 : 0;
        }
        if (ele.hasOwnProperty('list')) {
          ele.list.forEach(child => {
            child.isMust = !!child.isMust? 1 : 0;
          })
        }
        if (ele.hasOwnProperty('children')) {
          ele.children.forEach(function(el, ind) {
            el.sort = ind;
            el.isMust = !!el.isMust? 1 : 0;
            el.memory = !!el.memory? 1 : 0;
            if (el.hasOwnProperty('list')) {
              el.list.forEach(child => {
                child.isMust = !!child.isMust? 1 : 0;
              })
            }
            if (el.hasOwnProperty('openCapitalize')) {
              el.openCapitalize = !!el.openCapitalize ? 1 : 0;
            }
          });
          // 兼容老数据 把新字段复制给老字段
          ele.list = ele.children;
        }
      });
      if (!data.length) {
        that.$message.error({
          duration: 1000,
          message: '请先配置字段'
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
        status: 1,
        brandId: that.brandId,
        templateContent: JSON.stringify(data),
        title: that.templateObj.title,
        description: that.templateObj.description,
        storeType: that.templateObj.storeType,
        memory: []
      };
      postRequest('/haoban-app-daily-web/daily/save-define-template', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
            that.changeRoute(`/customReport?brandId=${that.brandId}&appIcon=${that.$route.query.appIcon}`)
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
        templateType: 1, // 模板类型
        brandId: that.brandId,
        templateContent: JSON.stringify(data)
      };
      postRequest('/haoban-app-daily-web/daily/preview-template', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // 生成二维码需要的 url
            let enterpriseId = JSON.parse(localStorage.getItem('userInfo')).enterpriseId;
            let webUrl = `${window.location.origin}/office-mobile/#/defineTemplate?enterpriseId=${enterpriseId}&templateId=${resData.result}&brandId=${that.brandId}`;
            that.$refs.qrcodePreview.qrcode(webUrl,'daily-preview');
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
      let that = this;
      that.dialogVisible = false;
    },

    /**
     *  获取已经存在门店
     */
    getHasStores() {
      let that = this;
      postRequest('/haoban-app-daily-web/daily/has-defined-template-store-type', { brandId: that.brandId })
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.storeList.forEach(ele => {
              if (!!resData.result &&!!resData.result.length && resData.result.includes(Number.parseInt(ele.id))) {
                ele.disabled = true;
              }
              if (that.oparateType == 'edit' && that.storeType == ele.id) {
                ele.disabled = false;
              }
            })
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
     *  获取所有字段
     */
    getAllFields(type) {
      let that = this;
      postRequest('/haoban-app-daily-web/daily/get-template-items', {brandId: that.brandId, type: type})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            resData.result.forEach(ele => {
              ele.isMust = !!ele.isMust ? true : false;
              ele.memory = !!ele.memory ? true : false;
              ele.title = (ele.title).trim(); // 返回字段有空格
              if (ele.hasOwnProperty('openCapitalize')) {
                ele.openCapitalize = !!ele.openCapitalize ? true : false;
              }
              if (ele.hasOwnProperty('list') && !!ele.list && !!ele.list.length) {
                ele.list.forEach(child => {
                  child.isMust = !!child.isMust ? true : false;
                })
              }
              if (type == 3) {
                ele.systemFlag = false;
              }else {
                ele.systemFlag = true;
              }
              if (ele.name.includes('groupc')) {
                ele.children = [];
              }
            })
            if(type == 3) {
              that.defineInfo = resData.result;
            }else {
              that.handleAllFields(resData.result);
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
     *  处理所有系统模板信息
     */
    handleAllFields(result) {
      let that = this;
      result.forEach((ele)=> {
        ele.fixed = false;
        if (ele.classify == 1) {
          ele.parentCode = 'tradeInfo';
          that.tradeInfo.push(ele);
        }
        if (ele.classify == 2) {
          ele.parentCode = 'personInfo';
          that.personInfo.push(ele);
        }
        if (ele.classify == 3) {
          ele.parentCode = 'goodsInfo';
          that.goodsInfo.push(ele);
        }
        if (ele.classify == 4) {
          ele.parentCode = 'competeInfo';
          that.competeInfo.push(ele);
        }
      });
    },

    /**
     *  获取已经保存模板信息---api
     */
    getInfo() {
      let that = this;
      postRequest('/haoban-app-daily-web/daily/get-define-template', {templateId: that.templateId})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.setList = [];
            if (!!resData.result) {
              that.templateObj.title = resData.result.title;
              that.templateObj.description = resData.result.description;
              that.storeType =  that.oparateType == 'edit'? String(resData.result.storeType) : '';
              that.templateObj.storeType = that.oparateType == 'edit'? String(resData.result.storeType): '';
              if (!!resData.result.templateContent && !!resData.result.templateContent.length) {
                that.handleGetInfo(resData.result.templateContent);
              }
            }
            that.getHasStores();
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
        }
        return father.parentCode == 0; //返回第一层
      });
      // 排序
      tree.sort(function(a, b) {
        return a.sort - b.sort;
      });

      tree.forEach(function(ele, index) {
        ele.children.sort(function(a, b) {
          return a.sort - b.sort;
        });
      });
      return tree;
    },

    /**
     * 处理已存配置信息
     */
    handleGetInfo(result) {
      const that = this;
      let data = JSON.parse(JSON.stringify(result));
      that.cids = []; // 设置计数器
      that.setParent = [];// 设置 fixed

      data.forEach(function(ele, index) {
        ele.title = (ele.title).trim(); // 返回字段有空格
        ele.isMust = !!ele.isMust ? true : false;
        ele.memory = !!ele.memory ? true : false;
        // 兼容老数据，增加字段
        let nameFlag = ele.name.includes('textc') || ele.name.includes('paragraphc') || ele.name.includes('numberc') || ele.name.includes('checkboxesOrRadioc') ||  ele.name.includes('datec') || ele.name.includes('dateareac') || ele.name.includes('picc') || ele.name.includes('introductionc') || ele.name.includes('pricec') || ele.name.includes('groupc');
        if (nameFlag) {
          // 自定义
          ele.systemFlag = false;
          ele.parentCode = 'defineInfo';
        }else {
          that.setParent.push(ele.name);
          ele.systemFlag = true;
          if (ele.classify == 1) {
            ele.parentCode = 'tradeInfo';
          }
          if (ele.classify == 2) {
            ele.parentCode = 'personInfo';
          }
          if (ele.classify == 3) {
            ele.parentCode = 'goodsInfo';
          }
          if (ele.classify == 4) {
            ele.parentCode = 'competeInfo';
          }
        }
        if (ele.hasOwnProperty('openCapitalize')) {
          ele.openCapitalize = !!ele.openCapitalize ? true : false;
        }
        if (ele.hasOwnProperty('list') && !!ele.list && !!ele.list.length) {
          ele.list.forEach(child => {
            child.isMust = !!child.isMust ? true : false;
            if (ele.name.includes('groupc')) { // 返回字段有空格
              child.isMust = !!child.isMust ? true : false;
              child.memory = !!child.memory ? true : false;

              let childFlag = child.name.includes('textc') || child.name.includes('paragraphc') || child.name.includes('numberc') || child.name.includes('checkboxesOrRadioc') ||  child.name.includes('datec') || child.name.includes('dateareac') || child.name.includes('picc') || child.name.includes('introductionc') || child.name.includes('pricec') || child.name.includes('groupc');
              if (childFlag) {
                child.systemFlag = false;
              }else {
                that.setParent.push(child.name);
                child.systemFlag = true;
                if (child.classify == 1) {
                  child.parentCode = 'tradeInfo';
                }
                if (child.classify == 2) {
                  child.parentCode = 'personInfo';
                }
                if (child.classify == 3) {
                  child.parentCode = 'goodsInfo';
                }
                if (child.classify == 4) {
                  child.parentCode = 'competeInfo';
                }
              }
            }
          })
          if (ele.name.includes('groupc')) {
            ele.children = ele.list;
          }
        }
        that.cids.push(Number.parseInt(ele.cid.match(/\d+/g)));
        if (ele.hasOwnProperty('children')) {
          ele.children.forEach(child => {
            child.isMust = !!child.isMust ? true : false;
            child.memory = !!child.memory ? true : false;
            that.cids.push(Number.parseInt(child.cid.match(/\d+/g)));
          })
        }
      });
      // 找出最大值，设置计数器
      that.counter = Math.max(...that.cids);
      // console.log(JSON.stringify(data))
      that.tempaletDataList = data;
      setTimeout(function() {
        that.setFixed();
      }, 500);
    },

    /**
     * 设置禁止拖拽
     */
    setFixed() {
      let that = this;
      let arr = ['tradeInfo','personInfo','goodsInfo','competeInfo'];
      arr.forEach(el => {
        that[el].forEach( ele => {
          if (that.setParent.includes(ele.name)) {
            ele.fixed = true;
          }
        });
      })
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
    imageCom,
    selectCom,
    dateRangeCom,
    inputCom,
    blockCom,
    qrcodeDialog

  },
  mounted() {
    let that = this;
    let query = that.$route.query;
    that.brandId = that.$route.query.brandId;
    // 获取已经配置的数据
    /* eslint-disable */
    Promise.all([that.getAllFields(2)]).then(values => {
      that.getAllFields(3);
      if(query.hasOwnProperty('templateId')) {
        that.templateId = query.templateId;
        that.oparateType = query.type;
        that.getInfo();
      }else {
        that.getHasStores();
      }
    }).catch(reason => {
      console.log(reason)
    });;
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  }
};
</script>
<style type="text/less" lang="less" scoped>
@import './template/template.less';
</style>
