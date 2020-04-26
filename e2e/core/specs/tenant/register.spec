# テナントの登録

## テナントの登録ができる
* テナント登録リクエスト"register"をPOSTする
* ステータスコードが"201"でレスポンスされる
* レスポンスボディの一部が"tenant/register"と一致する
* DBの"tenant"テーブルに"tenant/register"のデータセットが登録されている
