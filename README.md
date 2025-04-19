<h1>午餐訂訂</h1>
此程式讓使用者能夠自行新增餐廳，或是選擇已紀錄的餐廳開團，邀請他人共同訂餐。
詳情資料頁面會將資料整理為簡明易讀的格式，便於管理和查看。
<br>

<img src="LunchOrdering.png" style="width: 300px; height: 300px;">

<h2>功能</h2>
<li>由管理者來建立使用者帳號</li>
<li>使用者可以查看目前正在進行中的訂單</li>
<li>使用者可以查看餐廳清單、建立一間餐廳的資料或是編輯餐廳</li>
<li>只用者可以在喜歡的餐廳開請訂單供大家一起來訂餐</li>
<li>使用者可以在訂單資訊的頁面看到本次訂單的訂購數、訂購人、說明、總金額與餐廳資料</li>
<li>訂單的發起人和管理者可以關閉訂單也可以重新開啟</li>

<h2>系統需求</h2>

<li>Docker</li>

<h2>安裝</h2>

git clone https:

```
git clone https://github.com/Yuii24/LunchOrdering
```
<br>
2. 開啟專案

```
code LunchOrdering
```
<br>

3. 複製.env

```
cp .env.example .env
```

<br>

4. 按照指示填入.env資料

<br />

5. 使用Docekr啟動專案

用這個指令來運用Docker啟動專案
```
docker-compose up --build
```

<br />

6. 新增.env檔案
```
touch .env
```
新增後參考.env.example輸入資料

<br />
