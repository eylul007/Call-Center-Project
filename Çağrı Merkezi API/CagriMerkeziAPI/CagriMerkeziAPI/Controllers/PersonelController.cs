using CagriMerkeziAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace CagriMerkeziAPI.Controllers
{
    [Route("api/Personel")]
    [ApiController]
    public class PersonelController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PersonelController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("personel-liste")]
        public async Task<ActionResult<List<Personel>>> ButunPersonelleriListele()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            IEnumerable<Personel> personeller = await ButunPersonelleriSec(connection);
            return Ok(personeller);
        }

        [HttpGet("{personel_id}")]
        public async Task<ActionResult<Personel>> PersonelBilgisi(int personel_id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var personel = await connection.QueryFirstAsync<Personel>("select * from Personel where personel_id = @personel_id", new {personel_id = personel_id});
            return Ok(personel);
        }

        [HttpPost("personel-kayit")]
        public async Task<ActionResult<List<Personel>>> PersonelOlustur(Personel personel)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("insert into Personel (ad, soyad, email, telNo) values (@ad, @soyad, @email, @telNo)", personel);
            return Ok(await ButunPersonelleriSec(connection));
        }

        [HttpPut]
        public async Task<ActionResult<List<Personel>>> UpdatePersonel(Personel personel)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("update Personel set ad = @ad, soyad = @soyad, email = @email, telNo = @telNo where personel_id = @personel_id", personel);
            return Ok(await ButunPersonelleriSec(connection));
        }

        [HttpDelete("{personel_id}")]
        public async Task<ActionResult<List<Personel>>> PersonelSil(int personel_id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("delete from Personel where personel_id = @personel_id", new { personel_id = personel_id });
            return Ok(await ButunPersonelleriSec(connection));
        }

        private static async Task<IEnumerable<Personel>> ButunPersonelleriSec(SqlConnection connection)
        {
            return await connection.QueryAsync<Personel>("select * from Personel");
        }
    }
}
