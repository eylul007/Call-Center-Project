using CagriMerkeziAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace CagriMerkeziAPI.Controllers
{
    [Route("api/Cihaz")]
    [ApiController]
    public class CihazController : ControllerBase
    {
        private readonly IConfiguration _config;

        public CihazController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("cihaz-liste")]
        public async Task<ActionResult<List<Cihaz>>> ButunCihazlariListele()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            IEnumerable<Cihaz> cihazlar = await ButunCihazlariSec(connection);
            return Ok(cihazlar);
        }

        private static async Task<IEnumerable<Cihaz>> ButunCihazlariSec(SqlConnection connection)
        {
            return await connection.QueryAsync<Cihaz>("select * from Cihaz");
        }
    }
}
