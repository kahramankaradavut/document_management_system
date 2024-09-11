# Document Management System (Node.js & PostgreSQL)

### Proje Hakkında
Bu proje, Node.js ve PostgreSQL kullanılarak geliştirilmiş bir Doküman Yönetim Sistemi'dir. Projede, birimlerin (units) alt birimlere sahip olabileceği ve bu birimlerin doküman yükleyebileceği, bu dokümanları revize edebileceği bir yapı bulunmaktadır. Birimlerin alt birimleri ve yüklü dokümanları recursive olarak alınabilir.

### Özellikler
- Birimlerin (units) child-parent ilişkisine göre hierarchical bir yapıdadır.
- Birimlere ait dokümanlar eklenebilir ve bu dokümanlar revize edilebilir.
- Birimlere ve child birimlere ait dokümanlar JSON formatında recursive olarak elde edilebilir.
- Dokümanların eski versiyonları tutulur ve revizyon öncesi dosya yollarına erişilebilir.


## Kurulum Adımları

1. Bu projeyi klonlayın:

   ```bash
   git clone https://github.com/kahramankaradavut/document_management_system.git

2. Gerekli bağımlılıkları yükleyin:

   ```bash
   npm install
   npm init -y 
   npm install express pg multer dotenv

3. Veritabanı bağlantısını yapılandırmak için config/database.js dosyasını kullanın.

4. Sunucuyu başlatın:

   ```bash
   npm app.js

5. Sunucu, http://localhost:3000 adresinde çalışacaktır.

## Proje Yapısı

```lua
   document_management_system/
    ├── uploads/
    │   
    ├── src/
    │   ├── controllers/
    │   │   ├── documentController.js
    │   │   └── unitController.js
    │   ├── models/
    │   │   ├── db.js
    │   │   ├── documentModel.js
    │   │   └── unitModel.js
    │   └── routes/
    │       ├── documentRoutes.js
    │       └── unitRoutes.js
    │   
    ├── app.js
    └── .env
```


## API Endpointleri

### Units (Birimler) 

- `POST /api/units/`: Yeni birim oluşturur.
- `GET /api/units/`: Tüm ana birimleri ve altındaki chil birimleri getirir.
- `GET /api/units/:unitId/root-parent`: ID si verilen birimin root parent birimini getirir.
- `GET /api/units/:unitId/parent`: ID si verilen birimin bir üst parent birimini getirir.
- `GET /api/units/with-documents`: Tüm ana birimleri, child birimleri ve her birimin doküman bilgilerini getirir.

### Documents (Dokümanlar)

- `POST /api/documents/upload`: Yeni doküman oluşturur.
- `POST /api/documents/update`: Dokümanı revize eder ve bu bilgileri `document_revisions` tablosuna kayıt eder.
- `GET /api/documents/:id`: ID si verilen dokümanın bilgilerini getirir.
- `GET /api/documents/:documentId/previous-revision`: Dokümanın son versiyonundan bir önceki belgenin `file_path` ini getirir.



## Veritabanı Tabloları

### 1. Units Tablosu

| Kolon Adı  | Veri Tipi | Açıklama              |
|------------|-----------|-----------------------|
| id         | INT       | Primary Key (PK) |
| name       | VARCHAR   | Birim ismi         |
| parent_id      | INT   | Birimin parent ID'si |
| is_active      | BOOLEAN   | aktif/pasif |
| is_delete      | BOOLEAN   | silindi/silinmedi (soft delete) |

### 2. Documents Tablosu

| Kolon Adı  | Veri Tipi | Açıklama              |
|------------|-----------|-----------------------|
| id         | INT       | Primary Key (PK) |
| unit_id       | INT   | Birim ID'si         |
| original_name      | VARCHAR   | Dokümanın ismi |
| subject      | VARCHAR   | Dokümanın konusu |
| current_version      | INT   | Dokümanın revizyon sayısı |
| is_active      | BOOLEAN   | aktif/pasif |
| is_delete      | BOOLEAN   | silindi/silinmedi (soft delete) |
| file_path      | VARCHAR   | Dokümanın benzersiz ismiyle beraber tutulduğu yol |


### 3. Document Revisions Tablosu

| Kolon Adı  | Veri Tipi | Açıklama              |
|------------|-----------|-----------------------|
| id         | INT       | Primary Key (PK) |
| document_id       | INT   | Doküman ID'si        |
| revision_reason      | VARCHAR   | Revisyon sebebi |
| revision_number      | INT   | Dokümanın revize edilme sayısı|
| file_path      | VARCHAR   | Revize edilmiş dokümanın benzersiz ismiyle beraber tutulduğu yol |



## INSERT İşlemleri

### 1. Doküman Ekleme

```sql
INSERT INTO documents (unit_id, original_name, subject, file_path)
VALUES ($1, $2, $3, $4) RETURNING id
```

### 2. Revizyon Ekleme

```sql
INSERT INTO document_revisions (document_id, version_number, file_path, revision_reason)
VALUES ($1, $2, $3, $4)
```

### 3. Birim Ekleme

```sql
INSERT INTO units (name, parent_id) VALUES ($1, $2) RETURNING *
```



## Lisans

Bu proje [Apache License 2.0](./LICENSE) ile lisanslanmıştır. Daha fazla bilgi için [LICENSE](./LICENSE) dosyasına göz atabilirsiniz.



