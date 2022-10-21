using CagriMerkeziAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace CagriMerkeziAPI.Controllers
{
    [Route("api/Cagri")]
    [ApiController]
    public class CagriController : ControllerBase
    {
        private readonly IConfiguration _config;

        public CagriController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("cagri-liste")]

        public async Task<ActionResult<List<Cagri>>> ButunCagrilariListele()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            IEnumerable<Cagri> cagrilar = await ButunCagrilariSec(connection);
            return Ok(cagrilar);
        }

        [HttpGet("{cagri_id}")]
        public async Task<ActionResult<Personel>> PersonelBilgisi(int cagri_id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var cagri = await connection.QueryFirstAsync<Cagri>("select * from Cagri where cagri_id = @cagri_id", new { cagri_id = cagri_id });
            return Ok(cagri);
        }

        [HttpPost("cagri-kayit")]
        public async Task<ActionResult<List<Cagri>>> CagriOlustur(Cagri cagri)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("insert into Cagri (musteri_ad, musteri_soyad, musteri_telNo, musteri_email, sorun_basligi, sorun_aciklamasi, kayit_tarihi, termin_tarihi, servis_tarihi, servis_ucreti, personel_id, urun_grubu) values (@musteri_ad, @musteri_soyad, @musteri_telNo, @musteri_email, @sorun_basligi, @sorun_aciklamasi, @kayit_tarihi, @termin_tarihi, @servis_tarihi, @servis_ucreti, @personel_id, @urun_grubu)", cagri);
            return Ok(await ButunCagrilariSec(connection));
        }

        [HttpPut]
        public async Task<ActionResult<List<Cagri>>> UpdateCagri(Cagri cagri)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("update Cagri set musteri_ad = @musteri_ad, musteri_soyad = @musteri_soyad, musteri_telNo = @musteri_telNo, musteri_email = @musteri_email, sorun_basligi = @sorun_basligi, sorun_aciklamasi= @sorun_aciklamasi, kayit_tarihi = @kayit_tarihi, termin_tarihi = @termin_tarihi, servis_tarihi = @servis_tarihi, servis_ucreti = @servis_ucreti, personel_id = @personel_id, urun_grubu = @urun_grubu where cagri_id = @cagri_id", cagri);
            return Ok(await ButunCagrilariSec(connection));
        }

        [HttpDelete("{cagri_id}")]
        public async Task<ActionResult<List<Cagri>>> CagriSil(int cagri_id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("delete from Cagri where cagri_id = @cagri_id", new { cagri_id = cagri_id });
            return Ok(await ButunCagrilariSec(connection));
        }

        [HttpGet("{ilk_tarih}/{son_tarih}")]
        public async Task<ActionResult<Personel>> IkiTarihArasindakiKaydiBul(DateTime ilk_tarih, DateTime son_tarih)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var cagrilar = await connection.QueryAsync<Cagri>("select * from Cagri where kayit_tarihi between @ilk_tarih and @son_tarih ", new { ilk_tarih = ilk_tarih, son_tarih = son_tarih });
            return Ok(cagrilar);
        }

        private static async Task<IEnumerable<Cagri>> ButunCagrilariSec(SqlConnection connection)
        {
            return await connection.QueryAsync<Cagri>("select c.*, ch.cihaz_ismi from Cagri c,Cihaz ch where ch.cihaz_id = c.urun_grubu");
        }
    }
}
